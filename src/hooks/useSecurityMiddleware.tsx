import { useEffect } from 'react';
import { SecurityUtils, CSRFProtection } from '@/lib/security';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSecurityMiddleware = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize security measures
    initializeSecurity();
    
    // Set up security event listeners
    const securityListeners = setupSecurityListeners();
    
    return () => {
      // Cleanup listeners
      securityListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    };
  }, []);

  const initializeSecurity = () => {
    // Add CSP headers
    SecurityUtils.addCSPHeaders();
    
    // Initialize CSRF token
    CSRFProtection.getToken();
    
    // Disable right-click context menu on sensitive elements
    document.addEventListener('contextmenu', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-sensitive]')) {
        e.preventDefault();
      }
    });
    
    // Prevent drag and drop of sensitive content
    document.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-sensitive]')) {
        e.preventDefault();
      }
    });
  };

  const setupSecurityListeners = () => {
    const listeners: Array<{
      element: Element | Document | Window;
      event: string;
      handler: EventListener;
    }> = [];

    // Detect potential XSS attempts
    const xssHandler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value && SecurityUtils.detectInjection(target.value)) {
        target.value = SecurityUtils.sanitizeText(target.value);
        toast({
          title: "Security Warning",
          description: "Potentially malicious content was blocked",
          variant: "destructive"
        });
      }
    };

    // Add XSS detection to all input fields
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', xssHandler);
      listeners.push({ element: input, event: 'input', handler: xssHandler });
    });

    // Monitor for suspicious network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = resource.toString();
      
      // Add CSRF token to requests
      if (config && config.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method.toUpperCase())) {
        config.headers = CSRFProtection.addTokenToHeaders(config.headers as Record<string, string>);
      }
      
      // Block suspicious external requests
      if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
        throw new Error('Blocked suspicious request');
      }
      
      return originalFetch.apply(window, args);
    };

    // Detect and prevent clickjacking
    const clickjackHandler = () => {
      if (window.top !== window.self) {
        toast({
          title: "Security Alert",
          description: "This page cannot be displayed in a frame",
          variant: "destructive"
        });
        window.top!.location.href = window.self.location.href;
      }
    };

    window.addEventListener('load', clickjackHandler);
    listeners.push({ element: window, event: 'load', handler: clickjackHandler });

    // Monitor for unusual activity patterns
    let rapidClickCount = 0;
    const rapidClickHandler = () => {
      rapidClickCount++;
      if (rapidClickCount > 10) {
        toast({
          title: "Unusual Activity Detected",
          description: "Please slow down your interactions",
          variant: "destructive"
        });
        rapidClickCount = 0;
      }
      setTimeout(() => rapidClickCount = Math.max(0, rapidClickCount - 1), 1000);
    };

    document.addEventListener('click', rapidClickHandler);
    listeners.push({ element: document, event: 'click', handler: rapidClickHandler });

    return listeners;
  };

  const validateInput = (input: string, type: 'text' | 'email' | 'url' | 'username' = 'text'): string => {
    let sanitized = SecurityUtils.sanitizeText(input);
    
    switch (type) {
      case 'email':
        if (!SecurityUtils.validateEmail(sanitized)) {
          throw new Error('Invalid email format');
        }
        break;
      case 'url':
        if (!SecurityUtils.validateUrl(sanitized)) {
          throw new Error('Invalid URL format');
        }
        break;
      case 'username':
        if (!SecurityUtils.validateUsername(sanitized)) {
          throw new Error('Invalid username format');
        }
        break;
    }
    
    return sanitized;
  };

  const sanitizeContent = (content: string): string => {
    return SecurityUtils.sanitizeHtml(content);
  };

  const checkRateLimit = (action: string, limit: number = 5, windowMs: number = 60000): boolean => {
    return SecurityUtils.checkClientRateLimit(action, limit, windowMs);
  };

  return {
    validateInput,
    sanitizeContent,
    checkRateLimit,
    csrfToken: CSRFProtection.getToken(),
  };
};