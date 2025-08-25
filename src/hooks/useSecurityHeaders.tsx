import { useEffect } from 'react';
import { SecurityUtils } from '@/lib/security';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Add Content Security Policy headers
    SecurityUtils.addCSPHeaders();
    
    // Add security headers for clickjacking protection
    const addSecurityHeaders = () => {
      // Frame options meta tag (already applied via CSP but adding redundancy)
      const frameOptions = document.createElement('meta');
      frameOptions.httpEquiv = 'X-Frame-Options';
      frameOptions.content = 'DENY';
      document.head.appendChild(frameOptions);
      
      // Content type options
      const contentType = document.createElement('meta');
      contentType.httpEquiv = 'X-Content-Type-Options';
      contentType.content = 'nosniff';
      document.head.appendChild(contentType);
      
      // XSS protection
      const xssProtection = document.createElement('meta');
      xssProtection.httpEquiv = 'X-XSS-Protection';
      xssProtection.content = '1; mode=block';
      document.head.appendChild(xssProtection);
      
      // Referrer policy
      const referrerPolicy = document.createElement('meta');
      referrerPolicy.name = 'referrer';
      referrerPolicy.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerPolicy);
    };
    
    addSecurityHeaders();
  }, []);
};