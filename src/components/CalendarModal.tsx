import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ExternalLink, Download } from 'lucide-react';
import { extractPlainTextForSharing } from '../utils/textUtils';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    description?: string;
    event_date: string;
    event_time?: string;
    end_time?: string;
    location?: string;
  } | null;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  event
}) => {
  if (!event) return null;

  const handleCalendarAction = (type: 'google' | 'outlook' | 'apple' | 'mobile') => {
    // Create calendar event data
    const startDate = new Date(`${event.event_date}T${event.event_time || '00:00:00'}`);
    const endDate = event.end_time 
      ? new Date(`${event.event_date}T${event.end_time}`)
      : new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours

    // Format dates for calendar
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Create calendar event data
    const calendarData = {
      text: event.title,
      dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
      details: event.description ? extractPlainTextForSharing(event.description, 500) : '',
      location: event.location || '',
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    switch (type) {
      case 'mobile':
        // For mobile devices, try to open the device's default calendar app
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Try to detect the platform and use appropriate calendar URL
          const platform = navigator.platform || navigator.userAgent;
          
          if (/iPhone|iPad|iPod/i.test(platform)) {
            // iOS Calendar - try multiple approaches
            const iosCalendarUrl = `calshow://?title=${encodeURIComponent(calendarData.text)}&location=${encodeURIComponent(calendarData.location)}&notes=${encodeURIComponent(calendarData.details)}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            const iosWebUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.text)}&dates=${calendarData.dates}&details=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}&ctz=${encodeURIComponent(calendarData.ctz)}`;
            
            // Try to open iOS Calendar app, fallback to Google Calendar web
            try {
              window.location.href = iosCalendarUrl;
              // Fallback after a short delay if the app doesn't open
              setTimeout(() => {
                window.open(iosWebUrl, '_blank');
              }, 1000);
            } catch (error) {
              window.open(iosWebUrl, '_blank');
            }
          } else if (/Android/i.test(platform)) {
            // Android Calendar - try multiple approaches
            const googleCalendarAppUrl = `googlecalendar://event?action=CREATE&title=${encodeURIComponent(calendarData.text)}&location=${encodeURIComponent(calendarData.location)}&description=${encodeURIComponent(calendarData.details)}&startTime=${startDate.getTime()}&endTime=${endDate.getTime()}`;
            const googleCalendarWebUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.text)}&dates=${calendarData.dates}&details=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}&ctz=${encodeURIComponent(calendarData.ctz)}`;
            
            // Try to open Google Calendar app first, fallback to web
            try {
              window.location.href = googleCalendarAppUrl;
              // Fallback after a short delay if the app doesn't open
              setTimeout(() => {
                window.open(googleCalendarWebUrl, '_blank');
              }, 1000);
            } catch (error) {
              window.open(googleCalendarWebUrl, '_blank');
            }
          } else {
            // Fallback for other mobile devices
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.text)}&dates=${calendarData.dates}&details=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}&ctz=${encodeURIComponent(calendarData.ctz)}`;
            window.open(googleCalendarUrl, '_blank');
          }
        } else {
          // Desktop fallback
          const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.text)}&dates=${calendarData.dates}&details=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}&ctz=${encodeURIComponent(calendarData.ctz)}`;
          window.open(googleCalendarUrl, '_blank');
        }
        break;
        
      case 'google':
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.text)}&dates=${calendarData.dates}&details=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}&ctz=${encodeURIComponent(calendarData.ctz)}`;
        window.open(googleCalendarUrl, '_blank');
        break;
      
      case 'outlook':
        const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(calendarData.text)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(calendarData.details)}&location=${encodeURIComponent(calendarData.location)}`;
        window.open(outlookUrl, '_blank');
        break;
      
      case 'apple':
        const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDateForCalendar(startDate)}
DTEND:${formatDateForCalendar(endDate)}
SUMMARY:${calendarData.text}
DESCRIPTION:${calendarData.details}
LOCATION:${calendarData.location}
END:VEVENT
END:VCALENDAR`;
        
        const blob = new Blob([icsData], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add to Calendar
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your preferred calendar application:
                </p>
              </div>

                             <div className="space-y-3">
                 {/* Mobile Calendar (Primary option for mobile devices) */}
                 <button
                   onClick={() => handleCalendarAction('mobile')}
                   className="w-full flex items-center justify-between p-4 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors bg-emerald-50 dark:bg-emerald-900/10"
                 >
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                       <Calendar className="h-5 w-5 text-white" />
                     </div>
                     <div className="text-left">
                       <div className="font-medium text-gray-900 dark:text-white">Add to Phone Calendar</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Open in device calendar app</div>
                     </div>
                   </div>
                   <ExternalLink className="h-4 w-4 text-emerald-500" />
                 </button>

                 {/* Google Calendar */}
                 <button
                   onClick={() => handleCalendarAction('google')}
                   className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                 >
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                       <Calendar className="h-5 w-5 text-white" />
                     </div>
                     <div className="text-left">
                       <div className="font-medium text-gray-900 dark:text-white">Google Calendar</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Open in browser</div>
                     </div>
                   </div>
                   <ExternalLink className="h-4 w-4 text-gray-400" />
                 </button>

                 {/* Outlook Calendar */}
                 <button
                   onClick={() => handleCalendarAction('outlook')}
                   className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                 >
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                       <Calendar className="h-5 w-5 text-white" />
                     </div>
                     <div className="text-left">
                       <div className="font-medium text-gray-900 dark:text-white">Outlook Calendar</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Open in browser</div>
                     </div>
                   </div>
                   <ExternalLink className="h-4 w-4 text-gray-400" />
                 </button>

                 {/* Apple Calendar */}
                 <button
                   onClick={() => handleCalendarAction('apple')}
                   className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                 >
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-gray-800 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                       <Calendar className="h-5 w-5 text-white" />
                     </div>
                     <div className="text-left">
                       <div className="font-medium text-gray-900 dark:text-white">Apple Calendar</div>
                       <div className="text-sm text-gray-600 dark:text-gray-400">Download .ics file</div>
                     </div>
                   </div>
                   <Download className="h-4 w-4 text-gray-400" />
                 </button>
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
