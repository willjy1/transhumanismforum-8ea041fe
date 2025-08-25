import DOMPurify from 'dompurify';

// Security utility functions for input sanitization and validation
export class SecurityUtils {
  // Sanitize HTML content to prevent XSS attacks
  static sanitizeHtml(content: string): string {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'blockquote'],
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_NAMED_PROPS: true,
    });
  }

  // Sanitize plain text input
  static sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate URL format
  static validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  // Validate username (alphanumeric plus underscore, dash)
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }

  // Escape content for safe display
  static escapeHtml(content: string): string {
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
  }

  // Check for common injection patterns
  static detectInjection(input: string): boolean {
    const injectionPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /vbscript:/i,
      /expression\s*\(/i,
      /eval\s*\(/i,
      /alert\s*\(/i,
      /document\./i,
      /window\./i,
    ];

    return injectionPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting helper for client-side
  static checkClientRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
    return true;
  }

  // Generate secure random string for CSRF tokens
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
    return result;
  }

  // Content Security Policy helpers
  static addCSPHeaders(): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // For React dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://tiqkfmokjrmoyytqmhat.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'"
    ].join('; ');
    
    document.head.appendChild(meta);
  }
}

// CSRF Protection
export class CSRFProtection {
  private static readonly TOKEN_KEY = 'csrf_token';
  
  static getToken(): string {
    let token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      token = SecurityUtils.generateSecureToken();
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
    return token;
  }
  
  static validateToken(token: string): boolean {
    return token === this.getToken() && token.length === 32;
  }
  
  static addTokenToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    return {
      ...headers,
      'X-CSRF-Token': this.getToken(),
    };
  }
}