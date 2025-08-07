import React from 'react';
import { Download } from 'lucide-react';
import { trackDownloadClick } from '../services/downloadTracking';

interface TrackedDownloadLinkProps {
  fileUrl: string;
  fileName?: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export const TrackedDownloadLink: React.FC<TrackedDownloadLinkProps> = ({
  fileUrl,
  fileName,
  children,
  className = '',
  showIcon = true,
  iconSize = 16,
  onClick,
  disabled = false,
}) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (disabled) return;
    
    try {
      // Track the download
      await trackDownloadClick(fileUrl, fileName);
      
      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }
      
      // Trigger the actual download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error tracking download:', error);
      // Still try to download even if tracking fails
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {showIcon && <Download size={iconSize} />}
      <span>{children}</span>
    </button>
  );
};

// Alternative component that renders as a link
export const TrackedDownloadAnchor: React.FC<TrackedDownloadLinkProps & {
  href?: string;
}> = ({
  fileUrl,
  fileName,
  children,
  className = '',
  showIcon = true,
  iconSize = 16,
  onClick,
  disabled = false,
  href,
}) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (disabled) return;
    
    try {
      // Track the download
      await trackDownloadClick(fileUrl, fileName);
      
      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }
      
      // Trigger the actual download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error tracking download:', error);
      // Still try to download even if tracking fails
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <a
      href={href || fileUrl}
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200 ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {showIcon && <Download size={iconSize} />}
      <span>{children}</span>
    </a>
  );
}; 