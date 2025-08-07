// Download Tracking Service
// This service tracks file downloads and provides analytics

export interface DownloadEvent {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  downloadTime: string;
  userAgent: string;
  ipAddress?: string;
  referrer?: string;
  userId?: string;
  sessionId: string;
}

export interface DownloadAnalytics {
  totalDownloads: number;
  downloadsByFile: Record<string, number>;
  downloadsByDate: Record<string, number>;
  downloadsByType: Record<string, number>;
  recentDownloads: DownloadEvent[];
}

class DownloadTracker {
  private sessionId: string;
  private baseUrl: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Track a download event
  async trackDownload(downloadData: Omit<DownloadEvent, 'id' | 'downloadTime' | 'sessionId'>): Promise<void> {
    try {
      const downloadEvent: DownloadEvent = {
        ...downloadData,
        id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        downloadTime: new Date().toISOString(),
        sessionId: this.sessionId,
      };

      // Send to backend API
      await fetch(`${this.baseUrl}/api/downloads/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(downloadEvent),
      });

      // Also store locally for offline tracking
      this.storeLocalDownload(downloadEvent);

      console.log('Download tracked:', downloadEvent);
    } catch (error) {
      console.error('Error tracking download:', error);
      // Store locally if API fails
      this.storeLocalDownload({
        ...downloadData,
        id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        downloadTime: new Date().toISOString(),
        sessionId: this.sessionId,
      });
    }
  }

  // Store download locally (for offline tracking)
  private storeLocalDownload(downloadEvent: DownloadEvent): void {
    try {
      const existingDownloads = this.getLocalDownloads();
      existingDownloads.push(downloadEvent);
      
      // Keep only last 100 downloads locally
      if (existingDownloads.length > 100) {
        existingDownloads.splice(0, existingDownloads.length - 100);
      }
      
      localStorage.setItem('download_tracking', JSON.stringify(existingDownloads));
    } catch (error) {
      console.error('Error storing download locally:', error);
    }
  }

  // Get locally stored downloads
  private getLocalDownloads(): DownloadEvent[] {
    try {
      const stored = localStorage.getItem('download_tracking');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local downloads:', error);
      return [];
    }
  }

  // Sync local downloads with server
  async syncLocalDownloads(): Promise<void> {
    try {
      const localDownloads = this.getLocalDownloads();
      if (localDownloads.length === 0) return;

      await fetch(`${this.baseUrl}/api/downloads/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localDownloads),
      });

      // Clear local storage after successful sync
      localStorage.removeItem('download_tracking');
    } catch (error) {
      console.error('Error syncing local downloads:', error);
    }
  }

  // Get download analytics
  async getAnalytics(): Promise<DownloadAnalytics | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/downloads/analytics`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching download analytics:', error);
      return null;
    }
  }

  // Get recent downloads
  async getRecentDownloads(limit: number = 10): Promise<DownloadEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/downloads/recent?limit=${limit}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching recent downloads:', error);
      return [];
    }
  }

  // Track download with automatic file detection
  async trackFileDownload(fileUrl: string, fileName?: string): Promise<void> {
    const url = new URL(fileUrl, window.location.origin);
    const pathParts = url.pathname.split('/');
    const detectedFileName = fileName || pathParts[pathParts.length - 1];
    const fileExtension = detectedFileName.split('.').pop()?.toLowerCase() || 'unknown';
    
    // Determine file type from extension
    const fileTypeMap: Record<string, string> = {
      pdf: 'PDF Document',
      doc: 'Word Document',
      docx: 'Word Document',
      xls: 'Excel Spreadsheet',
      xlsx: 'Excel Spreadsheet',
      ppt: 'PowerPoint Presentation',
      pptx: 'PowerPoint Presentation',
      mp3: 'Audio File',
      mp4: 'Video File',
      jpg: 'Image',
      jpeg: 'Image',
      png: 'Image',
      gif: 'Image',
      txt: 'Text File',
      zip: 'Compressed File',
      rar: 'Compressed File',
    };

    const fileType = fileTypeMap[fileExtension] || 'Document';

    await this.trackDownload({
      fileName: detectedFileName,
      fileUrl: fileUrl,
      fileType: fileType,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      userId: this.getUserId(),
    });
  }

  // Get user ID from localStorage or generate one
  private getUserId(): string {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

  // Initialize tracking
  init(): void {
    // Sync local downloads on page load
    this.syncLocalDownloads();
    
    // Set up periodic sync
    setInterval(() => {
      this.syncLocalDownloads();
    }, 5 * 60 * 1000); // Sync every 5 minutes
  }
}

// Create and export singleton instance
export const downloadTracker = new DownloadTracker();

// Initialize tracking when module is loaded
if (typeof window !== 'undefined') {
  downloadTracker.init();
}

// Helper function to track download when link is clicked
export const trackDownloadClick = (fileUrl: string, fileName?: string): void => {
  downloadTracker.trackFileDownload(fileUrl, fileName);
};

// Helper function to create tracked download link
export const createTrackedDownloadLink = (
  fileUrl: string, 
  fileName?: string, 
  linkText?: string
): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName || '';
  link.textContent = linkText || fileName || 'Download';
  link.target = '_blank';
  
  link.addEventListener('click', () => {
    trackDownloadClick(fileUrl, fileName);
  });
  
  return link;
}; 