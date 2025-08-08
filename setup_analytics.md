# Website Analytics Setup Guide

## Overview

This guide will help you set up comprehensive website analytics for your church website. The system tracks:

- **Page Views**: Every page visit with detailed information
- **Sessions**: User sessions with duration and engagement metrics
- **Real-time Active Users**: Users currently on your website
- **Device & Browser Analytics**: What devices and browsers visitors use
- **Geographic Data**: Where your visitors are located
- **Top Pages**: Most visited pages on your website

## Setup Steps

### 1. Install Required Packages

First, install the required npm packages for the analytics system:

```bash
cd server
npm install uuid ua-parser-js geoip-lite
```

### 2. Set Up Database Tables

Run the analytics database setup script:

```bash
# Connect to your MySQL database
mysql -u root -p larachurch

# Run the analytics tables script
source server/database/analytics_tables.sql
```

Or manually execute the SQL commands from `server/database/analytics_tables.sql`.

### 3. Restart Your Server

After installing packages and setting up the database, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test the Analytics

1. **Visit your website** and navigate to different pages
2. **Check the admin dashboard** at `/admin` and go to the Analytics tab
3. **Verify data is being collected** by looking at the overview metrics

## Features

### 📊 **Real-time Analytics Dashboard**

- **Overview**: Key metrics, today's activity, top pages, device breakdown
- **Sessions**: Detailed session information with user data
- **Top Pages**: Most visited pages with view counts
- **Devices**: Device and browser usage statistics
- **Geography**: Visitor location data

### 🔍 **What Gets Tracked**

- **Page Views**: Every page visit with timestamp and duration
- **Sessions**: User sessions with start/end times and engagement
- **Device Info**: Browser, operating system, device type
- **Location**: Country and city based on IP address
- **User Behavior**: Time on page, bounce rate, page count
- **Real-time Data**: Active users in the last 30 minutes

### 📈 **Key Metrics**

- **Total Visitors**: Unique visitors to your website
- **Total Sessions**: User sessions (one visitor can have multiple sessions)
- **Page Views**: Total number of page views
- **Active Users**: Users currently on your website
- **Bounce Rate**: Percentage of single-page sessions
- **Session Duration**: Average time spent on your website

## Privacy & Compliance

### Data Collected

- **IP Address**: Used for geographic location (city/country level only)
- **User Agent**: Browser and device information
- **Page Path**: Which pages were visited
- **Session Data**: Session duration and engagement
- **Referrer**: Where visitors came from

### Data NOT Collected

- **Personal Information**: Names, emails, phone numbers
- **Exact Location**: Only city/country level
- **Browsing History**: Only pages on your website
- **Personal Identifiers**: No tracking across websites

### GDPR Compliance

- **Consent**: Analytics tracking is minimal and for website improvement
- **Data Retention**: Data is stored indefinitely but can be deleted
- **User Control**: Users can disable tracking via browser settings
- **Transparency**: This guide explains what data is collected

## Admin Dashboard Access

### Viewing Analytics

1. **Login to Admin**: Go to `/admin` and login with admin credentials
2. **Analytics Tab**: Click on the "Analytics" tab in the sidebar
3. **Overview**: See key metrics and today's activity
4. **Sessions**: View detailed session information
5. **Export**: Download analytics data (coming soon)

### Key Insights

- **Peak Hours**: When your website gets most traffic
- **Popular Pages**: Which pages are most visited
- **Device Usage**: How visitors access your site
- **Geographic Reach**: Where your visitors are located
- **Engagement**: How long visitors stay on your site

## Troubleshooting

### No Data Showing

1. **Check Database**: Ensure analytics tables were created
2. **Check Server Logs**: Look for errors in the server console
3. **Test Tracking**: Visit your website and check if data appears
4. **Browser Console**: Check for JavaScript errors

### Common Issues

- **"Analytics disabled"**: Check if `VITE_ENABLE_ANALYTICS` is set in development
- **"Failed to track"**: Check server logs for API errors
- **"No sessions"**: Ensure you've visited the website after setup

### Performance

- **Database Indexes**: Analytics tables include indexes for performance
- **Data Cleanup**: Old data can be cleaned up periodically
- **Caching**: Consider implementing caching for frequently accessed data

## Advanced Features (Coming Soon)

- **Custom Events**: Track specific user actions
- **Goal Tracking**: Track conversions and important actions
- **A/B Testing**: Test different page versions
- **Email Reports**: Automated analytics reports
- **API Access**: Programmatic access to analytics data

## Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Review server logs for errors**
3. **Verify database tables exist**
4. **Test with a fresh browser session**

The analytics system is designed to be lightweight and privacy-friendly while providing valuable insights into your website's performance and user engagement.
