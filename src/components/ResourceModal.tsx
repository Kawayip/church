import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { resourcesAPI, filesAPI, type Resource, type CreateResourceRequest } from '../services/api';

interface ResourceModalProps {
  resource?: Resource | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
  resource,
  onSuccess,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as const,
    fileType: 'pdf' as const,
    isFeatured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const isEditing = !!resource;

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description || '',
        category: resource.category,
        fileType: resource.fileType,
        isFeatured: resource.isFeatured
      });
    }
  }, [resource]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileSelect = (file: File) => {
    if (!isEditing) {
      setSelectedFile(file);
      // Auto-detect file type based on extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const fileTypeMap: { [key: string]: string } = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'mp4': 'video',
        'avi': 'video',
        'mov': 'video',
        'mp3': 'audio',
        'wav': 'audio',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'zip': 'zip'
      };
      const detectedType = fileTypeMap[extension || ''] || 'other';
      setFormData(prev => ({ ...prev, fileType: detectedType as any }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEditing && !selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        // Update existing resource
        const response = await resourcesAPI.update(resource!.id, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          isFeatured: formData.isFeatured
        });

        if (response.success) {
          onSuccess();
        } else {
          setError(response.message || 'Failed to update resource');
        }
      } else {
        // Create new resource
        if (!selectedFile) return;

        // Convert file to base64
        const fileData = await filesAPI.fileToBase64(selectedFile);
        
        const resourceData: CreateResourceRequest = {
          title: formData.title,
          description: formData.description,
          fileType: formData.fileType,
          category: formData.category,
          fileData,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          isFeatured: formData.isFeatured
        };

        const response = await resourcesAPI.create(resourceData);

        if (response.success) {
          onSuccess();
        } else {
          setError(response.message || 'Failed to create resource');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error saving resource:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'bulletins', label: 'Bulletins' },
    { value: 'sermons', label: 'Sermons' },
    { value: 'study-guides', label: 'Study Guides' },
    { value: 'sabbath-school', label: 'Sabbath School' },
    { value: 'music', label: 'Music' },
    { value: 'health', label: 'Health Ministry' },
    { value: 'youth', label: 'Youth' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' }
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Document' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'image', label: 'Image' },
    { value: 'zip', label: 'ZIP' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          >
            <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isEditing ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input w-full"
                    placeholder="Enter resource title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-textarea w-full"
                    placeholder="Enter resource description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="form-select w-full"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload (only for new resources) */}
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        dragActive
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-300 dark:border-slate-600'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="space-y-2">
                          <FileText className="h-8 w-8 text-emerald-500 mx-auto" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag and drop a file here, or{' '}
                            <label className="text-emerald-600 hover:text-emerald-500 cursor-pointer">
                              browse
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOC, Video, Audio, Image, or ZIP files
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* File Type (only for new resources) */}
                {!isEditing && (
                  <div>
                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Type *
                    </label>
                    <select
                      id="fileType"
                      name="fileType"
                      value={formData.fileType}
                      onChange={handleInputChange}
                      required
                      className="form-select w-full"
                    >
                      {fileTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="form-checkbox h-4 w-4 text-emerald-600"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mark as featured resource
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isEditing ? 'Update Resource' : 'Create Resource'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}; 