import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Image, Plus, Edit, Trash2, Search, Filter, 
  Loader2, AlertCircle, X, Upload, Eye
} from 'lucide-react';
import { galleryAPI, type GalleryItem, type CreateGalleryImageRequest, type CreateGalleryCollectionRequest, type GalleryCollection } from '../services/api';
import { filesAPI } from '../services/api';

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<GalleryCollection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCollectionUploadModalOpen, setIsCollectionUploadModalOpen] = useState(false);
  const [isCollectionViewModalOpen, setIsCollectionViewModalOpen] = useState(false);
  const [isCollectionEditModalOpen, setIsCollectionEditModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'collection'>('single');

  // Form state for single image
  const [formData, setFormData] = useState<CreateGalleryImageRequest>({
    title: '',
    description: '',
    category: 'general',
    imageData: '',
    imageType: '',
    imageName: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form state for collection
  const [collectionFormData, setCollectionFormData] = useState<CreateGalleryCollectionRequest>({
    title: '',
    description: '',
    category: 'general',
    images: []
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'events', name: 'Events' },
    { id: 'services', name: 'Services' },
    { id: 'outreach', name: 'Outreach' },
    { id: 'youth', name: 'Youth' },
    { id: 'general', name: 'General' }
  ];

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getAll({
        page: currentPage,
        limit: 12,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchTerm || undefined
      });
      
      if (response.success && response.data) {
        setItems(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError(response.message || 'Failed to fetch gallery items');
      }
    } catch (err) {
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [currentPage, selectedCategory, searchTerm]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        imageName: file.name,
        imageType: file.type
      }));
    }
  };

  const handleFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const imageData = await filesAPI.fileToBase64(selectedFile);
      const uploadData = {
        ...formData,
        imageData
      };

      const response = await galleryAPI.upload(uploadData);
      
      if (response.success) {
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          category: 'general',
          imageData: '',
          imageType: '',
          imageName: ''
        });
        setSelectedFile(null);
        fetchItems();
      } else {
        setError(response.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const images = [];
      for (const file of selectedFiles) {
        const imageData = await filesAPI.fileToBase64(file);
        images.push({
          imageData,
          imageType: file.type,
          imageName: file.name
        });
      }

      const uploadData = {
        ...collectionFormData,
        images
      };

      const response = await galleryAPI.uploadCollection(uploadData);
      
      if (response.success) {
        setIsCollectionUploadModalOpen(false);
        setCollectionFormData({
          title: '',
          description: '',
          category: 'general',
          images: []
        });
        setSelectedFiles([]);
        fetchItems();
      } else {
        setError(response.message || 'Failed to upload collection');
      }
    } catch (err) {
      setError('Failed to upload collection');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await galleryAPI.delete(id);
      if (response.success) {
        fetchItems();
      } else {
        setError(response.message || 'Failed to delete item');
      }
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    if (item.type === 'collection') {
      // For collections, we need to fetch the full collection data first
      handleViewCollection(item.id);
    } else {
      // For single images
      setSelectedItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        category: item.category,
        imageData: '',
        imageType: '',
        imageName: ''
      });
      setIsModalOpen(true);
    }
  };

  const handleViewCollection = async (id: number) => {
    try {
      const response = await galleryAPI.getCollection(id);
      if (response.success && response.data) {
        setSelectedCollection(response.data);
        setIsCollectionViewModalOpen(true);
      } else {
        setError(response.message || 'Failed to fetch collection');
      }
    } catch (err) {
      setError('Failed to fetch collection');
    }
  };

  const handleEditCollection = () => {
    if (selectedCollection) {
      setCollectionFormData({
        title: selectedCollection.title,
        description: selectedCollection.description || '',
        category: selectedCollection.category,
        images: []
      });
      setIsCollectionViewModalOpen(false);
      setIsCollectionEditModalOpen(true);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setUploading(true);
    setError(null);

    try {
      const response = await galleryAPI.update(selectedItem.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category
      });
      
      if (response.success) {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
          title: '',
          description: '',
          category: 'general',
          imageData: '',
          imageType: '',
          imageName: ''
        });
        fetchItems();
      } else {
        setError(response.message || 'Failed to update item');
      }
    } catch (err) {
      setError('Failed to update item');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollection) return;

    setUploading(true);
    setError(null);

    try {
      const response = await galleryAPI.updateCollection(selectedCollection.id, {
        title: collectionFormData.title,
        description: collectionFormData.description,
        category: collectionFormData.category
      });
      
      if (response.success) {
        setIsCollectionEditModalOpen(false);
        setSelectedCollection(null);
        setCollectionFormData({
          title: '',
          description: '',
          category: 'general',
          images: []
        });
        fetchItems();
      } else {
        setError(response.message || 'Failed to update collection');
      }
    } catch (err) {
      setError('Failed to update collection');
    } finally {
      setUploading(false);
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setIsImageEditModalOpen(true);
  };

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    setUploading(true);
    setError(null);

    try {
      const response = await galleryAPI.updateImage(editingImage.id, {
        title: editingImage.title,
        description: editingImage.description
      });
      
      if (response.success) {
        setIsImageEditModalOpen(false);
        setEditingImage(null);
        // Refresh the collection view
        if (selectedCollection) {
          const collectionResponse = await galleryAPI.getCollection(selectedCollection.id);
          if (collectionResponse.success && collectionResponse.data) {
            setSelectedCollection(collectionResponse.data);
          }
        }
      } else {
        setError(response.message || 'Failed to update image');
      }
    } catch (err) {
      setError('Failed to update image');
    } finally {
      setUploading(false);
    }
  };

  const openModal = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      imageData: '',
      imageType: '',
      imageName: ''
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage church gallery images and collections</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setUploadMode('single');
              openModal();
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Image</span>
          </button>
          <button
            onClick={() => {
              setUploadMode('collection');
              setIsCollectionUploadModalOpen(true);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Image className="h-5 w-5" />
            <span>Add Collection</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Gallery Items</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={fetchItems} className="btn-primary">Try Again</button>
        </div>
      ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Gallery Items Found</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by uploading your first image or collection'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <div className="flex space-x-3 justify-center">
                <button onClick={openModal} className="btn-primary">Upload First Image</button>
                <button 
                  onClick={() => setIsCollectionUploadModalOpen(true)}
                  className="btn-secondary"
                >
                  Upload First Collection
                </button>
              </div>
            )}
          </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={galleryAPI.getImage(item.thumbnail_image_id)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (item.type === 'collection') {
                              handleViewCollection(item.id);
                            } else {
                              setSelectedItem(item);
                              setIsViewModalOpen(true);
                            }
                          }}
                          className="flex-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded text-sm hover:bg-white/30 transition-colors"
                        >
                          <Eye className="h-4 w-4 inline mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-emerald-500 text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collection indicator */}
                  {item.type === 'collection' && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {item.image_count} images
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span className="capitalize">{item.category}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   {selectedItem ? 'Edit Image' : 'Upload New Image'}
                 </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

                             <form onSubmit={selectedItem ? handleUpdate : handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input w-full"
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-textarea w-full"
                    rows={3}
                    placeholder="Enter image description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="form-select w-full"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                                 {!selectedItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                        required
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedFile ? selectedFile.name : 'Click to select an image file'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PNG, JPG, GIF up to 25MB
                        </p>
                      </label>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                                         ) : (
                       selectedItem ? 'Update Image' : 'Upload Image'
                     )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <img
                  src={galleryAPI.getImage(selectedItem.thumbnail_image_id)}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedItem.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Category:</span>
                    <span className="ml-2 capitalize text-gray-900 dark:text-white">
                      {selectedItem.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Uploaded:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(selectedItem.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleEdit(selectedItem);
                    }}
                    className="flex-1 btn-primary"
                  >
                    Edit Item
                  </button>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      handleDelete(selectedItem.id);
                    }}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Collection Upload Modal */}
      {isCollectionUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Image Collection
                </h3>
                <button
                  onClick={() => setIsCollectionUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCollectionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={collectionFormData.title}
                    onChange={(e) => setCollectionFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input w-full"
                    placeholder="e.g., Saturday Service Photos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={collectionFormData.description}
                    onChange={(e) => setCollectionFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="form-textarea w-full"
                    rows={3}
                    placeholder="Describe this collection of images"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={collectionFormData.category}
                    onChange={(e) => setCollectionFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="form-select w-full"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Images *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesSelect}
                      className="hidden"
                      id="collection-images-upload"
                      required
                    />
                    <label htmlFor="collection-images-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedFiles.length > 0 
                          ? `${selectedFiles.length} image(s) selected`
                          : 'Click to select multiple images'
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF up to 25MB each
                      </p>
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Files:
                      </h4>
                      <div className="space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCollectionUploadModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Upload Collection'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Collection View Modal */}
      {isCollectionViewModalOpen && selectedCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCollection.title}
                </h3>
                <button
                  onClick={() => {
                    setIsCollectionViewModalOpen(false);
                    setSelectedCollection(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedCollection.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Category:</span>
                    <span className="ml-2 capitalize text-gray-900 dark:text-white">
                      {selectedCollection.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Images:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedCollection.images.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedCollection.images.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={galleryAPI.getImage(image.id)}
                        alt={image.title || `Image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleEditImage(image)}
                          className="bg-emerald-500 text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                      {image.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg text-xs">
                          {image.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                                 <div className="flex space-x-3 pt-4">
                   <button
                     onClick={handleEditCollection}
                     className="flex-1 btn-primary"
                   >
                     Edit Collection
                   </button>
                   <button
                     onClick={() => {
                       setIsCollectionViewModalOpen(false);
                       setSelectedCollection(null);
                       handleDelete(selectedCollection.id);
                     }}
                     className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                   >
                     Delete Collection
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
                 </div>
       )}

       {/* Collection Edit Modal */}
       {isCollectionEditModalOpen && selectedCollection && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
           >
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   Edit Collection
                 </h3>
                 <button
                   onClick={() => {
                     setIsCollectionEditModalOpen(false);
                     setSelectedCollection(null);
                   }}
                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>

               <form onSubmit={handleUpdateCollection} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Collection Title *
                   </label>
                   <input
                     type="text"
                     required
                     value={collectionFormData.title}
                     onChange={(e) => setCollectionFormData(prev => ({ ...prev, title: e.target.value }))}
                     className="form-input w-full"
                     placeholder="e.g., Saturday Service Photos"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Description
                   </label>
                   <textarea
                     value={collectionFormData.description}
                     onChange={(e) => setCollectionFormData(prev => ({ ...prev, description: e.target.value }))}
                     className="form-textarea w-full"
                     rows={3}
                     placeholder="Describe this collection of images"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Category *
                   </label>
                   <select
                     required
                     value={collectionFormData.category}
                     onChange={(e) => setCollectionFormData(prev => ({ ...prev, category: e.target.value as any }))}
                     className="form-select w-full"
                   >
                     {categories.filter(cat => cat.id !== 'all').map(category => (
                       <option key={category.id} value={category.id}>
                         {category.name}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                   <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Collection Images ({selectedCollection.images.length})
                   </h4>
                   <p className="text-xs text-gray-500 dark:text-gray-500">
                     Images cannot be modified in this view. To change images, delete and recreate the collection.
                   </p>
                 </div>

                 {error && (
                   <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                     {error}
                   </div>
                 )}

                 <div className="flex space-x-3 pt-4">
                   <button
                     type="button"
                     onClick={() => {
                       setIsCollectionEditModalOpen(false);
                       setSelectedCollection(null);
                     }}
                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={uploading}
                     className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {uploading ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                       'Update Collection'
                     )}
                   </button>
                 </div>
               </form>
             </div>
           </motion.div>
         </div>
       )}

       {/* Image Edit Modal */}
       {isImageEditModalOpen && editingImage && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
           >
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                   Edit Image
                 </h3>
                 <button
                   onClick={() => {
                     setIsImageEditModalOpen(false);
                     setEditingImage(null);
                   }}
                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                 >
                   <X className="h-6 w-6" />
                 </button>
               </div>

               <div className="mb-4">
                 <img
                   src={galleryAPI.getImage(editingImage.id)}
                   alt={editingImage.title || 'Image'}
                   className="w-full rounded-lg"
                 />
               </div>

               <form onSubmit={handleUpdateImage} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Image Title
                   </label>
                   <input
                     type="text"
                     value={editingImage.title || ''}
                     onChange={(e) => setEditingImage(prev => prev ? { ...prev, title: e.target.value } : null)}
                     className="form-input w-full"
                     placeholder="Enter image title"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Description
                   </label>
                   <textarea
                     value={editingImage.description || ''}
                     onChange={(e) => setEditingImage(prev => prev ? { ...prev, description: e.target.value } : null)}
                     className="form-textarea w-full"
                     rows={3}
                     placeholder="Enter image description"
                   />
                 </div>

                 {error && (
                   <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                     {error}
                   </div>
                 )}

                 <div className="flex space-x-3 pt-4">
                   <button
                     type="button"
                     onClick={() => {
                       setIsImageEditModalOpen(false);
                       setEditingImage(null);
                     }}
                     className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={uploading}
                     className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {uploading ? (
                       <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                       'Update Image'
                     )}
                   </button>
                 </div>
               </form>
             </div>
           </motion.div>
         </div>
       )}
     </div>
   );
 }; 