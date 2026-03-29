import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { addProduct, updateProduct } from '../services/adminProductsService';
import { toast } from 'react-toastify';

const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  // 1. Initial State Setup
  const initialForm = {
    productName: '',
    productDescription: '',
    productPrice: '',
    fabric: '',
    category: 'Abaya',
    collection: 'New Arrival',
    stock: 0,
  };

  const [formData, setFormData] = useState(initialForm);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store new files
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. If 'product' prop exists, we are in EDIT mode. Fill the form.
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        fabric: product.fabric,
        category: product.category,
        collection: product.collection,
        stock: product.stock,
      });
    } else {
      setFormData(initialForm);
    }
    setSelectedFiles([]); // Reset files when opening/closing
  }, [product, isOpen]);

  // 3. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      // Append text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append images
      selectedFiles.forEach((file) => {
        data.append('productImg', file);
      });

      if (product) {
        // UPDATE Logic
        await updateProduct(product._id, data);
        toast("Product updated successfully");
      } else {
        // ADD Logic
        await addProduct(data);
        toast("Product added successfully")
      }

      onSuccess(); // Refresh the product list in ProductPage
      onClose();   // Close the modal
    } catch (error) {
      alert(error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
const handleSetThumbnail = (index) => {
  // Create a copy of the existing images
  const updatedImgs = [...formData.productImg];
  
  // 1. Remove the image from its current position
  const [selectedImage] = updatedImgs.splice(index, 1);
  
  // 2. Put it at the very beginning (Index 0)
  updatedImgs.unshift(selectedImage);
  
  // 3. Update the state
  setFormData({ ...formData, productImg: updatedImgs });
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Name</label>
              <input name="productName" value={formData.productName} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Price (Rs)</label>
              <input name="productPrice" type="number" value={formData.productPrice} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} required rows="3" className="w-full p-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
                {['Abaya', 'Hijab', 'Dupatta', 'Shawl', 'Stoller', 'Kids'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Collection</label>
              <select name="collection" value={formData.collection} onChange={handleChange} className="w-full p-2 border rounded-lg">
                {['New Arrival', 'Eid Special', 'Daily Basis', 'Winter', 'Summer'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Stock</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Fabric</label>
            <input name="fabric" value={formData.fabric} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center">
            <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" accept="image/*" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
              
              <Upload className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {selectedFiles.length > 0 ? `${selectedFiles.length} images selected` : 'Click to upload product images (Max 5)'}
              </span>
            </label>
          </div>
          

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;