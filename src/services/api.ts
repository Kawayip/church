const API_BASE_URL = 'http://localhost:5000/api';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth interfaces
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'member' | 'guest';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  baptism_date?: string;
  created_at: string;
}

// Event interfaces
interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  end_time?: string;
  location?: string;
  event_type: 'service' | 'meeting' | 'outreach' | 'youth' | 'special';
  is_featured: boolean;
  image_url?: string;
  image_data?: string;
  image_type?: string;
  image_name?: string;
  created_at: string;
  updated_at: string;
}

interface CreateEventRequest {
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  end_time?: string;
  location?: string;
  event_type: 'service' | 'meeting' | 'outreach' | 'youth' | 'special';
  is_featured?: boolean;
  featured_image?: File;
}

interface UpdateEventRequest extends Partial<CreateEventRequest> {
  remove_image?: boolean;
}

// Sermon interfaces
interface Sermon {
  id: number;
  title: string;
  preacher: string;
  sermon_date: string;
  scripture_reference?: string;
  description?: string;
  video_url?: string;
  audio_url?: string;
  notes_url?: string;
  duration_minutes?: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Ministry interfaces
interface Ministry {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  featured_image_data?: string;
  featured_image_type?: string;
  featured_image_name?: string;
  leader_name?: string;
  leader_email?: string;
  leader_phone?: string;
  meeting_time?: string;
  meeting_location?: string;
  contact_info?: string;
  requirements?: string;
  age_group?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface CreateMinistryRequest {
  name: string;
  description: string;
  long_description?: string;
  leader_name?: string;
  leader_email?: string;
  leader_phone?: string;
  meeting_time?: string;
  meeting_location?: string;
  contact_info?: string;
  requirements?: string;
  age_group?: string;
  status?: 'active' | 'inactive';
  featured_image?: File;
  slug?: string;
}

interface UpdateMinistryRequest extends Partial<CreateMinistryRequest> {
  remove_image?: boolean;
}

// Contact interfaces
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Post interfaces
interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author_id: number;
  first_name?: string;
  last_name?: string;
  author_email?: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featured_image_data?: string;
  featured_image_type?: string;
  featured_image_name?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  view_count: number;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  status?: 'draft' | 'published' | 'archived';
  is_featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

interface UpdatePostRequest extends Partial<CreatePostRequest> {}

interface PostsResponse {
  success: boolean;
  data: Post[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

interface PostResponse {
  success: boolean;
  data: Post;
  message?: string;
}

interface CategoriesResponse {
  success: boolean;
  data: string[];
  message?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Don't set Content-Type for FormData - let browser set it automatically
  const isFormData = options.body instanceof FormData;
  
  const config: RequestInit = {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  console.log('Auth token available:', !!token);
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    } as Record<string, string>;
    console.log('Authorization header set:', 'Yes');
  } else {
    console.log('No auth token found in localStorage');
  }

  try {
    console.log('Making API request to:', url);
    console.log('Request config:', config);
    
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);

    // Return the data directly - the backend handles success/error states
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<{ success: boolean; message?: string; token?: string; user?: User }> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<User>> => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },
};

// Events API functions
export const eventsAPI = {
  getAll: async (params?: { featured?: boolean; type?: string; limit?: number }): Promise<ApiResponse<Event[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<Event>> => {
    return apiRequest(`/events/${id}`);
  },

  getUpcoming: async (limit?: number): Promise<ApiResponse<Event[]>> => {
    const queryString = limit ? `?limit=${limit}` : '';
    return apiRequest(`/events/upcoming/events${queryString}`);
  },

  create: async (eventData: CreateEventRequest): Promise<ApiResponse<Event>> => {
    if (eventData.featured_image) {
      // Convert image to base64 and send as JSON
      const imageBase64 = await filesAPI.fileToBase64(eventData.featured_image);
      const requestData = {
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        end_time: eventData.end_time,
        location: eventData.location,
        event_type: eventData.event_type,
        is_featured: eventData.is_featured,
        image_data: imageBase64,
        image_type: eventData.featured_image.type,
        image_name: eventData.featured_image.name
      };
      
      return apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    } else {
      // No image, send regular data
      const requestData = {
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        end_time: eventData.end_time,
        location: eventData.location,
        event_type: eventData.event_type,
        is_featured: eventData.is_featured
      };
      
      return apiRequest('/events', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    }
  },

  update: async (id: number, eventData: UpdateEventRequest): Promise<ApiResponse<Event>> => {
    if (eventData.featured_image) {
      // Convert image to base64 and send as JSON
      const imageBase64 = await filesAPI.fileToBase64(eventData.featured_image);
      const requestData = {
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        end_time: eventData.end_time,
        location: eventData.location,
        event_type: eventData.event_type,
        is_featured: eventData.is_featured,
        image_data: imageBase64,
        image_type: eventData.featured_image.type,
        image_name: eventData.featured_image.name
      };
      
      return apiRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });
    } else if (eventData.remove_image) {
      // Remove image
      const requestData = {
        ...eventData,
        image_data: null,
        image_type: null,
        image_name: null
      };
      delete requestData.featured_image;
      delete requestData.remove_image;
      
      return apiRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });
    } else {
      // No image changes, send regular data
      const requestData = { ...eventData };
      delete requestData.featured_image;
      delete requestData.remove_image;
      
      return apiRequest(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });
    }
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  getImageUrl: (eventId: number): string => {
    return `${API_BASE_URL}/events/${eventId}/image`;
  },
};

// Sermons API functions
export const sermonsAPI = {
  getAll: async (params?: { featured?: boolean; preacher?: string; limit?: number }): Promise<ApiResponse<Sermon[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.preacher) searchParams.append('preacher', params.preacher);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/sermons${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<Sermon>> => {
    return apiRequest(`/sermons/${id}`);
  },

  getLatest: async (limit?: number): Promise<ApiResponse<Sermon[]>> => {
    const queryString = limit ? `?limit=${limit}` : '';
    return apiRequest(`/sermons/latest/sermons${queryString}`);
  },

  getByPreacher: async (preacher: string, limit?: number): Promise<ApiResponse<Sermon[]>> => {
    const queryString = limit ? `?limit=${limit}` : '';
    return apiRequest(`/sermons/preacher/${preacher}${queryString}`);
  },

  create: async (sermonData: Omit<Sermon, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Sermon>> => {
    return apiRequest('/sermons', {
      method: 'POST',
      body: JSON.stringify(sermonData),
    });
  },

  update: async (id: number, sermonData: Partial<Sermon>): Promise<ApiResponse<Sermon>> => {
    return apiRequest(`/sermons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sermonData),
    });
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/sermons/${id}`, {
      method: 'DELETE',
    });
  },
};



// Contact API functions
export const contactAPI = {
  submit: async (messageData: ContactRequest): Promise<ApiResponse> => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getAll: async (params?: { unread?: boolean; limit?: number }): Promise<ApiResponse<ContactMessage[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.unread !== undefined) searchParams.append('unread', params.unread.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/contact${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<ContactMessage>> => {
    return apiRequest(`/contact/${id}`);
  },

  markAsRead: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/contact/${id}/read`, {
      method: 'PUT',
    });
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/contact/${id}`, {
      method: 'DELETE',
    });
  },

  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return apiRequest('/contact/unread/count');
  },
};

// Dashboard API functions
export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse<{
    users: number;
    events: number;
    sermons: number;
    ministries: number;
    unreadMessages: number;
  }>> => {
    return apiRequest('/dashboard/stats');
  },
};

// Health check
export const healthAPI = {
  check: async (): Promise<ApiResponse> => {
    return apiRequest('/health');
  },
};

// Resource interfaces
interface Resource {
  id: number;
  title: string;
  description?: string;
  file_type: 'pdf' | 'doc' | 'video' | 'audio' | 'image' | 'zip';
  category: 'bulletins' | 'sermons' | 'study-guides' | 'sabbath-school' | 'music' | 'health' | 'youth' | 'training' | 'other';
  file_name: string;
  file_size: number;
  mime_type: string;
  download_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateResourceRequest {
  title: string;
  description?: string;
  fileType: 'pdf' | 'doc' | 'video' | 'audio' | 'image' | 'zip';
  category: 'bulletins' | 'sermons' | 'study-guides' | 'sabbath-school' | 'music' | 'health' | 'youth' | 'training' | 'other';
  fileData: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
  isFeatured?: boolean;
}

interface UpdateResourceRequest extends Partial<CreateResourceRequest> {}

// File handling API
export const filesAPI = {
  // Upload image to gallery
  uploadGalleryImage: async (data: {
    title: string;
    description?: string;
    category: 'events' | 'services' | 'outreach' | 'youth' | 'general';
    imageData: string;
    imageType: string;
    imageName: string;
  }): Promise<ApiResponse<{ id: number }>> => {
    return apiRequest('/files/gallery', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get image from gallery
  getGalleryImage: (id: number): string => `${API_BASE_URL}/files/gallery/${id}`,

  // Upload resource file
  uploadResource: async (data: CreateResourceRequest): Promise<ApiResponse<{ id: number }>> => {
    return apiRequest('/files/resources', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get resource file
  getResource: (id: number): string => `${API_BASE_URL}/files/resources/${id}`,

  // Upload sermon media
  uploadSermonMedia: async (sermonId: number, data: {
    mediaType: 'video' | 'audio' | 'notes';
    mediaData: string;
    mimeType: string;
    fileName: string;
  }): Promise<ApiResponse> => {
    return apiRequest(`/files/sermons/${sermonId}/media`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get sermon media
  getSermonMedia: (sermonId: number, mediaType: 'video' | 'audio' | 'notes'): string => 
    `${API_BASE_URL}/files/sermons/${sermonId}/${mediaType}`,

  // Helper function to convert file to base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
};

// Resources API functions
export const resourcesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Resource[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/resources${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<Resource>> => {
    return apiRequest(`/resources/${id}`);
  },

  create: async (data: CreateResourceRequest): Promise<ApiResponse<Resource>> => {
    return apiRequest('/resources', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  update: async (id: number, data: UpdateResourceRequest): Promise<ApiResponse<Resource>> => {
    return apiRequest(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/resources/${id}`, {
      method: 'DELETE'
    });
  },

  download: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/resources/${id}/download`, {
      method: 'POST'
    });
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiRequest('/resources/categories');
  }
};

// Posts API functions
export const postsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    featured?: boolean;
    author_id?: number;
  }): Promise<ApiResponse<Post[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.author_id) searchParams.append('author_id', params.author_id.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/posts${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: number): Promise<ApiResponse<Post>> => {
    return apiRequest(`/posts/${id}`);
  },

  create: async (postData: CreatePostRequest & { featured_image?: File }): Promise<ApiResponse<Post>> => {
    const formData = new FormData();
    
    // Add text fields
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (postData.excerpt) formData.append('excerpt', postData.excerpt);
    if (postData.category) formData.append('category', postData.category);
    if (postData.tags) formData.append('tags', postData.tags);
    if (postData.status) formData.append('status', postData.status);
    if (postData.is_featured !== undefined) formData.append('is_featured', postData.is_featured.toString());
    if (postData.meta_title) formData.append('meta_title', postData.meta_title);
    if (postData.meta_description) formData.append('meta_description', postData.meta_description);
    
    // Add image if provided
    if (postData.featured_image) {
      formData.append('featured_image', postData.featured_image);
    }

    return apiRequest('/posts', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  update: async (id: number, postData: UpdatePostRequest & { featured_image?: File; remove_image?: boolean }): Promise<ApiResponse<Post>> => {
    const formData = new FormData();
    
    // Add text fields
    if (postData.title) formData.append('title', postData.title);
    if (postData.content) formData.append('content', postData.content);
    if (postData.excerpt !== undefined) formData.append('excerpt', postData.excerpt);
    if (postData.category) formData.append('category', postData.category);
    if (postData.tags) formData.append('tags', postData.tags);
    if (postData.status) formData.append('status', postData.status);
    if (postData.is_featured !== undefined) formData.append('is_featured', postData.is_featured.toString());
    if (postData.meta_title) formData.append('meta_title', postData.meta_title);
    if (postData.meta_description) formData.append('meta_description', postData.meta_description);
    
    // Add image if provided
    if (postData.featured_image) {
      formData.append('featured_image', postData.featured_image);
    }
    
    // Handle image removal
    if (postData.remove_image) {
      formData.append('remove_image', 'true');
    }

    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiRequest('/posts/categories');
  },

  getPublished: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<Post[]>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('status', 'published');
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const queryString = searchParams.toString();
    return apiRequest(`/posts?${queryString}`);
  },

  getImageUrl: (postId: number): string => {
    return `${API_BASE_URL}/posts/${postId}/image`;
  },
};

// Ministries API functions
export const ministriesAPI = {
  getAll: async (page = 1, limit = 10, status = 'active'): Promise<ApiResponse<Ministry[]>> => {
    return apiRequest<Ministry[]>(`/ministries?page=${page}&limit=${limit}&status=${status}`);
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Ministry>> => {
    return apiRequest<Ministry>(`/ministries/${slug}`);
  },

  create: async (data: CreateMinistryRequest): Promise<ApiResponse<Ministry>> => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(data).forEach(key => {
      if (key !== 'featured_image' && data[key as keyof CreateMinistryRequest] !== undefined) {
        formData.append(key, data[key as keyof CreateMinistryRequest] as string);
      }
    });
    
    // Add image if provided
    if (data.featured_image) {
      formData.append('featured_image', data.featured_image);
    }

    return apiRequest<Ministry>('/ministries', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  },

  update: async (id: number, data: UpdateMinistryRequest): Promise<ApiResponse<Ministry>> => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(data).forEach(key => {
      if (key !== 'featured_image' && data[key as keyof UpdateMinistryRequest] !== undefined) {
        formData.append(key, data[key as keyof UpdateMinistryRequest] as string);
      }
    });
    
    // Add image if provided
    if (data.featured_image) {
      formData.append('featured_image', data.featured_image);
    }

    return apiRequest<Ministry>(`/ministries/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/ministries/${id}`, { method: 'DELETE' });
  },

  getImageUrl: (id: number): string => {
    return `${API_BASE_URL}/ministries/${id}/image`;
  }
};

// Export types
export type {
  User,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  Sermon,
  Ministry,
  CreateMinistryRequest,
  UpdateMinistryRequest,
  ContactMessage,
  ContactRequest,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest
};