import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { content, type, userId, csrfToken } = await req.json();

    // Validate CSRF token
    const sessionCsrfToken = req.headers.get('x-csrf-token');
    if (!sessionCsrfToken || sessionCsrfToken !== csrfToken) {
      console.log('CSRF token validation failed');
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Advanced content validation
    const validationResult = await validateContent(content, type);
    if (!validationResult.isValid) {
      console.log('Content validation failed:', validationResult.reason);
      return new Response(JSON.stringify({ 
        error: 'Content validation failed',
        reason: validationResult.reason 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(supabase, userId, type);
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded for user:', userId);
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: rateLimitResult.retryAfter 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(content);

    return new Response(JSON.stringify({ 
      success: true,
      sanitizedContent,
      contentScore: validationResult.score 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in security-validate function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function validateContent(content: string, type: string) {
  // Length validation
  if (content.length > 10000) {
    return { isValid: false, reason: 'Content too long', score: 0 };
  }

  if (content.length < 3) {
    return { isValid: false, reason: 'Content too short', score: 0 };
  }

  // Spam detection patterns
  const spamPatterns = [
    /buy now/gi,
    /click here/gi,
    /free money/gi,
    /earn \$\d+/gi,
    /viagra/gi,
    /casino/gi,
    /bitcoin.*guaranteed/gi,
    /make.*money.*fast/gi,
    /work.*from.*home/gi,
    /limited.*time.*offer/gi,
  ];

  let spamScore = 0;
  spamPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      spamScore += matches.length;
    }
  });

  if (spamScore > 3) {
    return { isValid: false, reason: 'Spam content detected', score: spamScore };
  }

  // XSS detection
  const xssPatterns = [
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:.*base64/gi,
    /vbscript:/gi,
    /expression\s*\(/gi,
    /eval\s*\(/gi,
    /alert\s*\(/gi,
  ];

  const hasXSS = xssPatterns.some(pattern => pattern.test(content));
  if (hasXSS) {
    return { isValid: false, reason: 'Potential XSS content detected', score: 100 };
  }

  // Profanity and harmful content detection (basic)
  const harmfulPatterns = [
    /f[u*]+ck/gi,
    /sh[i*]+t/gi,
    /b[i*]+tch/gi,
    /n[i*]+gg[e*]+r/gi,
    /kill yourself/gi,
    /commit suicide/gi,
  ];

  const hasProfanity = harmfulPatterns.some(pattern => pattern.test(content));
  if (hasProfanity) {
    return { isValid: false, reason: 'Inappropriate content detected', score: 50 };
  }

  // Content quality score (higher is better)
  let qualityScore = 50;
  
  // Bonus for proper sentences
  if (content.includes('.') || content.includes('?') || content.includes('!')) {
    qualityScore += 10;
  }
  
  // Bonus for reasonable length
  if (content.length > 50 && content.length < 1000) {
    qualityScore += 20;
  }
  
  // Penalty for excessive caps
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (capsRatio > 0.5) {
    qualityScore -= 20;
  }

  return { isValid: true, score: qualityScore };
}

async function checkRateLimit(supabase: any, userId: string, action: string) {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Count recent actions
    const { data, error } = await supabase
      .from('user_activity')
      .select('created_at')
      .eq('user_id', userId)
      .eq('action', action)
      .gte('created_at', oneHourAgo.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Fail open for availability
    }

    const actionCount = data?.length || 0;
    const limits: Record<string, number> = {
      'post_create': 5,
      'comment_create': 20,
      'note_create': 30,
      'vote_cast': 100,
      'message_send': 10,
    };

    const limit = limits[action] || 10;
    
    if (actionCount >= limit) {
      const nextAllowedTime = new Date(now.getTime() + 60 * 60 * 1000);
      return { 
        allowed: false, 
        retryAfter: Math.ceil((nextAllowedTime.getTime() - now.getTime()) / 1000) 
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true }; // Fail open
  }
}

function sanitizeContent(content: string): string {
  // Enhanced server-side sanitization
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^>]*>/gi, '')
    .replace(/<input\b[^>]*>/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/eval\s*\(/gi, '')
    .replace(/alert\s*\(/gi, '')
    .replace(/document\./gi, '')
    .replace(/window\./gi, '')
    .trim();
}