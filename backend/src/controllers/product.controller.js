import uploadOnCloudinary from "../utils/cloudinary.js"
import Product from "../models/productSchema.js"
import { v2 as cloudinary } from "cloudinary"

const addProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, fabric, category, collection } = req.body
        const userId = req.user._id

        if (!productName || !productDescription || !productPrice || !fabric || !category || !collection) {
            return res.status(400).json({
                success: false,
                message: "All fields are Required"
            })
        }

        // 2. Check if files were actually uploaded by Multer
        // Note: Multer uses req.files (plural) for multiple files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "Product images are required" });
        }

        // 3. Upload all images to Cloudinary in parallel
        // We map each file to an upload promise
        const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path));

        // Wait for all uploads to finish
        const cloudinaryResponses = await Promise.all(uploadPromises);

        // 4. Format the data for the productImg array in our Schema
        const productImgData = cloudinaryResponses
            .filter((response) => response !== null) // Remove failed uploads
            .map((response) => ({
                url: response.secure_url,
                public_id: response.public_id
            }));

        if (productImgData.length === 0) {
            return res.status(500).json({ success: false, message: "Error uploading images to Cloudinary" });
        }

        // 5. Create the Product in MongoDB
        const product = await Product.create({
            userId,
            productName,
            productDescription,
            productPrice,
            fabric,
            category,
            collection,
            productImg: productImgData // This matches your [{url, public_id}] schema
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const allProducts = await Product.find()
        if (!allProducts) {
            return res.status(404).json({
                success: false,
                message: "No Products Found"
            })
        }
        return res.status(200).json({
            success: true,
            allProducts
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Product.findById(productId)
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        //Delete images from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {
                const response = await cloudinary.uploader.destroy(img.public_id)
            }
        }

        const deleteProduct = await Product.findByIdAndDelete(productId)
        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, fabric, category, collection, existingImages } = req.body
        const { productId } = req.params
        
        // Fetch the product first
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        
        let updatedImages = []
        //keep selected existing images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages)
            updatedImages = product.productImg.filter((img) => keepIds.includes(img.public_id))

            //delete only removed images
            const removedImages = product.productImg.filter((img) => !keepIds.includes(img.public_id))
            for (const img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id)
            }
        } else {
            updatedImages = product.productImg //keep all if nothing sent
        }
        
        // Upload new images if any
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) => uploadOnCloudinary(file.path))
            const cloudinaryResponses = await Promise.all(uploadPromises)
            
            const productImgData = cloudinaryResponses
                .filter((response) => response !== null)
                .map((response) => ({
                    url: response.secure_url,
                    public_id: response.public_id
                }))
            
            updatedImages = productImgData
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                productName: productName || product.productName,
                productDescription: productDescription || product.productDescription,
                productPrice: productPrice || product.productPrice,
                fabric: fabric || product.fabric,
                category: category || product.category,
                collection: collection || product.collection,
                productImg: updatedImages
            },
            { new: true }
        )
        
        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product: updatedProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export {
    addProduct,
    getAllProduct,
    deleteProduct,
    updateProduct
}