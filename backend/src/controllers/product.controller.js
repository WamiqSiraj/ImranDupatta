import uploadOnCloudinary from "../utils/cloudinary.js"
import Product from "../models/productSchema.js"
import { v2 as cloudinary } from "cloudinary"

const addProduct = async (req, res) => {
    try {
        const { productName, productDescription, productPrice, fabric, category, collection, stock } = req.body
        const userId = req.user._id

        if (!productName || !productDescription || !productPrice || !fabric || !category || !collection || !stock) {
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
            productImg: productImgData, // This matches your [{url, public_id}] schema
            stock
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

// const getAllProduct = async (req, res) => {
//     try {
//         const allProducts = await Product.find()
//         if (!allProducts) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No Products Found"
//             })
//         }
//         return res.status(200).json({
//             success: true,
//             allProducts
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

const getAllProduct = async (req, res) => {
    try {
        // 1. Destructure query parameters from the URL
        const {
            category,
            collection,
            search,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        // 2. Build a dynamic Filter Object
        let filter = {};

        // Filter by Category or Collection (if provided)
        if (category) filter.category = category;
        if (collection) filter.collection = collection;

        // Search functionality (Case-insensitive search on Name or Description)
        if (search) {
            filter.$or = [
                { productName: { $regex: search, $options: "i" } },
                { productDescription: { $regex: search, $options: "i" } }
            ];
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            filter.productPrice = {};
            if (minPrice) filter.productPrice.$gte = Number(minPrice);
            if (maxPrice) filter.productPrice.$lte = Number(maxPrice);
        }

        // 3. Define Sorting
        let sortOrder = { createdAt: -1 }; // Default: Newest first
        if (sort === "priceLow") sortOrder = { productPrice: 1 };
        if (sort === "priceHigh") sortOrder = { productPrice: -1 };

        const limit = Number(req.query.limit) || 0;
        // 4. Execute Query
        const allProducts = await Product.find(filter)
            .sort(sortOrder)
            .limit(limit)
            .populate("userId", "name email"); // Optional: get admin/user info

        if (!allProducts || allProducts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Products Found matching these criteria"
            });
        }

        return res.status(200).json({
            success: true,
            count: allProducts.length,
            allProducts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product and populate user info (optional, if you need seller details)
        const product = await Product.findById(id).populate("userId", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // Handle cases where ID might be malformed
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID format"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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
                console.log("Cloudinary Response: ", response);
                
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
        const { productName, productDescription, productPrice, fabric, category, collection, stock, existingImages } = req.body
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
                productImg: updatedImages,
                stock: stock || product.stock
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
    getProductById,
    deleteProduct,
    updateProduct
}