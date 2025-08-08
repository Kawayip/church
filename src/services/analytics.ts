// Analytics Service for tracking website usage
// This service handles page views, sessions, and user engagement tracking

export interface AnalyticsData {
  sessionId: string;
  pagePath: string;
  pageTitle: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  screenResolution: string;
  timeOnPage?: number;
  userId?: number;
  landingPage?: string;
}

export interface DashboardStats {
  total: {
    total_sessions: number;
    total_visitors: number;
    total_page_views: number;
  };
  today: {
    today_sessions: number;
    today_visitors: number;
    today_page_views: number;
  };
  activeUsers: number;
  topPages: Array<{
    page_path: string;
    page_title: string;
    total_views: number;
  }>;
  deviceStats: Array<{
    device_type: string;
    count: number;
  }>;
  dailyStats: Array<{
    date: string;
    sessions: number;
    visitors: number;
    page_views: number;
  }>;
}

export interface SessionData {
  id: string;
  user_id: number | null;
  ip_address: string;
  user_agent: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  os: string;
  screen_resolution: string;
  start_time: string;
  end_time: string | null;
  duration: number;
  page_count: number;
  is_bounce: boolean;
  referrer: string;
  landing_page: string;
  exit_page: string;
  page_views: number;
  first_name?: string;
  last_name?: string;
  email?: string;
}

class AnalyticsService {
  private sessionId: string;
  private startTime: number;
  private currentPage: string;
  private pageStartTime: number;
  private isTracking: boolean = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.currentPage = window.location.pathname;
    this.pageStartTime = Date.now();
    this.init();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getScreenResolution(): string {
    return `${window.screen.width}x${window.screen.height}`;
  }

  private getReferrer(): string {
    return document.referrer || '';
  }

  private async getIPAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not get IP address:', error);
      return 'unknown';
    }
  }

  private async trackPageView(pagePath: string, pageTitle: string, timeOnPage: number = 0) {
    if (!this.isTracking) return;

    try {
      const ipAddress = await this.getIPAddress();
      
      const data: AnalyticsData = {
        sessionId: this.sessionId,
        pagePath,
        pageTitle,
        referrer: this.getReferrer(),
        userAgent: navigator.userAgent,
        ipAddress,
        screenResolution: this.getScreenResolution(),
        timeOnPage
      };

      await fetch('/api/analytics/track-page-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  private async trackSession(landingPage: string) {
    if (!this.isTracking) return;

    try {
      const ipAddress = await this.getIPAddress();
      
      const data = {
        sessionId: this.sessionId,
        userId: this.getUserId(),
        userAgent: navigator.userAgent,
        ipAddress,
        referrer: this.getReferrer(),
        landingPage,
        screenResolution: this.getScreenResolution(),
      };

      await fetch('/api/analytics/track-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.warn('Failed to track session:', error);
    }
  }

  private getUserId(): number | undefined {
    // Get user ID from localStorage or context if available
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id;
      } catch (error) {
        console.warn('Failed to parse user data:', error);
      }
    }
    return undefined;
  }

  private handlePageChange() {
    const newPage = window.location.pathname;
    if (newPage !== this.currentPage) {
      // Track the previous page view
      const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
      this.trackPageView(this.currentPage, document.title, timeOnPage);
      
      // Update current page
      this.currentPage = newPage;
      this.pageStartTime = Date.now();
    }
  }

  private handleBeforeUnload() {
    // Track the current page view before leaving
    const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
    this.trackPageView(this.currentPage, document.title, timeOnPage);
    
    // End session
    this.endSession();
  }

  private async endSession() {
    if (!this.isTracking) return;

    try {
      await fetch('/api/analytics/end-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          exitPage: this.currentPage,
        }),
      });
    } catch (error) {
      console.warn('Failed to end session:', error);
    }
  }

  private init() {
    // Check if analytics should be enabled (not in development for testing)
    if (import.meta.env.DEV && !import.meta.env.VITE_ENABLE_ANALYTICS) {
      console.log('Analytics disabled in development mode');
      return;
    }

    this.isTracking = true;

    // Track initial session
    this.trackSession(window.location.pathname);

    // Set up event listeners
    window.addEventListener('popstate', () => this.handlePageChange());
    window.addEventListener('beforeunload', () => this.handleBeforeUnload());

    // Track page changes for SPA navigation
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        this.handlePageChange();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Track initial page view after a short delay
    setTimeout(() => {
      this.trackPageView(window.location.pathname, document.title);
    }, 1000);
  }

  // Public methods

  public trackEvent(eventName: string, category?: string, action?: string, label?: string, value?: number) {
    if (!this.isTracking) return;

    try {
      fetch('/api/analytics/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          eventName,
          eventCategory: category,
          eventAction: action,
          eventLabel: label,
          eventValue: value,
          pagePath: window.location.pathname,
        }),
      });
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public enableTracking() {
    this.isTracking = true;
  }

  public disableTracking() {
    this.isTracking = false;
  }
}

// Create and export singleton instance
export const analytics = new AnalyticsService();

// API functions for admin dashboard

export const analyticsAPI = {
  // Get dashboard statistics
  async getDashboardStats(days: number = 30): Promise<{ success: boolean; data?: DashboardStats; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/analytics/dashboard-stats?days=${days}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard statistics',
      };
    }
  },

  // Get detailed analytics
  async getDetailedAnalytics(filters: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/analytics/detailed?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching detailed analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch detailed analytics',
      };
    }
  },

  // Get active users
  async getActiveUsers(): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/analytics/active-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      return {
        success: false,
        message: 'Failed to fetch active users',
      };
    }
  },
};

// Helper functions

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
