import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2 } from 'lucide-react';
import { ministriesAPI, Ministry, CreateMinistryRequest, UpdateMinistryRequest } from '../services/api';

interface MinistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ministry?: Ministry | null;
}

export const MinistryModal: React.FC<MinistryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ministry
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    long_description: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    meeting_time: '',
    meeting_location: '',
    contact_info: '',
    requirements: '',
    age_group: '',
    status: 'active' as 'active' | 'inactive'
  });

  const isEditing = Boolean(ministry && ministry.id);

  // Reset form when modal opens/closes or ministry changes
  useEffect(() => {
    if (isOpen) {
      // Always reset form first
      setFormData({
        name: '',
        description: '',
        long_description: '',
        leader_name: '',
        leader_email: '',
        leader_phone: '',
        meeting_time: '',
        meeting_location: '',
        contact_info: '',
        requirements: '',
        age_group: '',
        status: 'active'
      });

      // Then populate if editing
      if (ministry && ministry.id) {
        setFormData({
          name: ministry.name || '',
          description: ministry.description || '',
          long_description: ministry.long_description || '',
          leader_name: ministry.leader_name || '',
          leader_email: ministry.leader_email || '',
          leader_phone: ministry.leader_phone || '',
          meeting_time: ministry.meeting_time || '',
          meeting_location: ministry.meeting_location || '',
          contact_info: ministry.contact_info || '',
          requirements: ministry.requirements || '',
          age_group: ministry.age_group || '',
          status: ministry.status || 'active'
        });
      }

      // Reset image states
      setRemoveImage(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [isOpen, ministry?.id]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setRemoveImage(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setRemoveImage(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      const data: CreateMinistryRequest = { ...formData };
      if (selectedImage) {
        data.featured_image = selectedImage;
      }

      let response;
      if (isEditing && ministry) {
        const updateData: UpdateMinistryRequest = { ...data };
        if (removeImage) {
          updateData.remove_image = true;
        }
        response = await ministriesAPI.update(ministry.id, updateData);
      } else {
        response = await ministriesAPI.create(data);
      }

      if (response.success) {
        onSuccess();
      } else {
        alert(response.message || 'Failed to save ministry');
      }
    } catch (error) {
      console.error('Error saving ministry:', error);
      alert('Failed to save ministry');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    setSelectedImage(null);
    setImagePreview(null);
    setRemoveImage(false);
    onClose();
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Ministry' : 'Create New Ministry'}
                  </h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ministry Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter ministry name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Short Description *
                    </label>
                                         <textarea
                       name="description"
                       value={formData.description}
                       onChange={handleInputChange}
                       required
                       rows={3}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                       placeholder="Brief description of the ministry"
                     />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Long Description
                    </label>
                                         <textarea
                       name="long_description"
                       value={formData.long_description}
                       onChange={handleInputChange}
                       rows={5}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                       placeholder="Detailed description of the ministry's purpose and activities"
                     />
                  </div>

                  {/* Leader Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leader Name
                      </label>
                                             <input
                         type="text"
                         name="leader_name"
                         value={formData.leader_name}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="Leader's full name"
                       />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leader Email
                      </label>
                                             <input
                         type="email"
                         name="leader_email"
                         value={formData.leader_email}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="leader@email.com"
                       />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Leader Phone
                      </label>
                                             <input
                         type="tel"
                         name="leader_phone"
                         value={formData.leader_phone}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="+256 701 234 567"
                       />
                    </div>
                  </div>

                  {/* Meeting Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Time
                      </label>
                                             <input
                         type="text"
                         name="meeting_time"
                         value={formData.meeting_time}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="e.g., Every Sabbath 2:00 PM"
                       />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Location
                      </label>
                                             <input
                         type="text"
                         name="meeting_location"
                         value={formData.meeting_location}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="e.g., Youth Hall"
                       />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Age Group
                      </label>
                                             <input
                         type="text"
                         name="age_group"
                         value={formData.age_group}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="e.g., 13-30 years"
                       />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requirements
                      </label>
                                             <input
                         type="text"
                         name="requirements"
                         value={formData.requirements}
                         onChange={handleInputChange}
                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                         placeholder="e.g., No prior experience required"
                       />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Information
                    </label>
                                         <textarea
                       name="contact_info"
                       value={formData.contact_info}
                       onChange={handleInputChange}
                       rows={3}
                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                       placeholder="Additional contact information or instructions"
                     />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        imagePreview || (ministry?.featured_image_data && !removeImage)
                          ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {imagePreview || (ministry?.featured_image_data && !removeImage) ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview || (ministry ? ministriesAPI.getImageUrl(ministry.id) : '')}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <div className="flex justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                            >
                              Change Image
                            </button>
                            <button
                              type="button"
                              onClick={handleImageRemove}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div>
                            <button
                              type="button"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Choose Image
                            </button>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              or drag and drop an image here
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : isEditing ? 'Update Ministry' : 'Create Ministry'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 