
/**
 * System monitoring and crash prevention utilities
 */

interface CrashReport {
  timestamp: string;
  error: Error;
  userAgent: string;
  url: string;
  userId?: string;
  merchantId?: string;
  context?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    api: boolean;
    database: boolean;
    authentication: boolean;
    payments: boolean;
  };
  lastCheck: string;
}

// Global error handler
export const initializeErrorMonitoring = () => {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    reportCrash({
      timestamp: new Date().toISOString(),
      error: new Error(`Unhandled Promise Rejection: ${event.reason}`),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: { type: 'unhandledrejection' }
    });
  });

  // Catch JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    reportCrash({
      timestamp: new Date().toISOString(),
      error: event.error || new Error(event.message),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: { 
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  });
};

// Report crash to monitoring system
export const reportCrash = (crashReport: CrashReport) => {
  try {
    // Store in localStorage for debugging
    const crashes = JSON.parse(localStorage.getItem('rizzpay_crashes') || '[]');
    crashes.push(crashReport);
    
    // Keep only last 10 crashes
    if (crashes.length > 10) {
      crashes.splice(0, crashes.length - 10);
    }
    
    localStorage.setItem('rizzpay_crashes', JSON.stringify(crashes));

    // Log to console for immediate debugging
    console.error('CRASH REPORT:', crashReport);

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/monitoring/crash-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crashReport)
      }).catch(err => console.error('Failed to send crash report:', err));
    }
  } catch (error) {
    console.error('Failed to report crash:', error);
  }
};

// Get recent crashes for debugging
export const getRecentCrashes = (): CrashReport[] => {
  try {
    return JSON.parse(localStorage.getItem('rizzpay_crashes') || '[]');
  } catch {
    return [];
  }
};

// Clear crash reports
export const clearCrashReports = () => {
  localStorage.removeItem('rizzpay_crashes');
};

// System health check with AbortController for timeout
export const performHealthCheck = async (): Promise<SystemHealth> => {
  const health: SystemHealth = {
    status: 'healthy',
    checks: {
      api: false,
      database: false,
      authentication: false,
      payments: false
    },
    lastCheck: new Date().toISOString()
  };

  try {
    // Check API connectivity with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const apiResponse = await fetch('/api/health', { 
        method: 'GET',
        signal: controller.signal
      });
      health.checks.api = apiResponse.ok;
    } catch {
      health.checks.api = false;
    } finally {
      clearTimeout(timeoutId);
    }

    // Check database connectivity
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
      
      const dbResponse = await fetch('/api/db-health', { 
        method: 'GET',
        signal: controller2.signal
      });
      health.checks.database = dbResponse.ok;
      clearTimeout(timeoutId2);
    } catch {
      health.checks.database = false;
    }

    // Check authentication service
    try {
      const controller3 = new AbortController();
      const timeoutId3 = setTimeout(() => controller3.abort(), 5000);
      
      const authResponse = await fetch('/api/auth/health', { 
        method: 'GET',
        signal: controller3.signal
      });
      health.checks.authentication = authResponse.ok;
      clearTimeout(timeoutId3);
    } catch {
      health.checks.authentication = false;
    }

    // Check payment service
    try {
      const controller4 = new AbortController();
      const timeoutId4 = setTimeout(() => controller4.abort(), 5000);
      
      const paymentResponse = await fetch('/api/payments/health', { 
        method: 'GET',
        signal: controller4.signal
      });
      health.checks.payments = paymentResponse.ok;
      clearTimeout(timeoutId4);
    } catch {
      health.checks.payments = false;
    }

  } catch (error) {
    console.error('Health check failed:', error);
  }

  // Determine overall status
  const failedChecks = Object.values(health.checks).filter(check => !check).length;
  
  if (failedChecks === 0) {
    health.status = 'healthy';
  } else if (failedChecks <= 2) {
    health.status = 'warning';
  } else {
    health.status = 'critical';
  }

  return health;
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    return {
      used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Performance monitoring
export const trackPageLoad = (pageName: string) => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  const metrics = {
    page: pageName,
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    firstContentfulPaint: 0,
    timestamp: new Date().toISOString()
  };

  // Get First Contentful Paint if available
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcp) {
    metrics.firstContentfulPaint = fcp.startTime;
  }

  console.log('Page Performance:', metrics);
  
  // Store performance data
  const performanceData = JSON.parse(localStorage.getItem('rizzpay_performance') || '[]');
  performanceData.push(metrics);
  
  // Keep only last 20 entries
  if (performanceData.length > 20) {
    performanceData.splice(0, performanceData.length - 20);
  }
  
  localStorage.setItem('rizzpay_performance', JSON.stringify(performanceData));
};

// API call monitoring
export const trackApiCall = (endpoint: string, method: string, duration: number, status: number) => {
  const apiMetric = {
    endpoint,
    method,
    duration,
    status,
    timestamp: new Date().toISOString(),
    success: status >= 200 && status < 300
  };

  console.log('API Call:', apiMetric);

  // Store API metrics
  const apiMetrics = JSON.parse(localStorage.getItem('rizzpay_api_metrics') || '[]');
  apiMetrics.push(apiMetric);
  
  // Keep only last 50 entries
  if (apiMetrics.length > 50) {
    apiMetrics.splice(0, apiMetrics.length - 50);
  }
  
  localStorage.setItem('rizzpay_api_metrics', JSON.stringify(apiMetrics));

  // Alert on slow API calls
  if (duration > 5000) {
    console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
  }

  // Alert on API errors
  if (!apiMetric.success) {
    console.error(`API call failed: ${method} ${endpoint} returned ${status}`);
  }
};

// Get monitoring dashboard data
export const getMonitoringData = () => {
  return {
    crashes: getRecentCrashes(),
    performance: JSON.parse(localStorage.getItem('rizzpay_performance') || '[]'),
    apiMetrics: JSON.parse(localStorage.getItem('rizzpay_api_metrics') || '[]'),
    memory: getMemoryUsage()
  };
};
