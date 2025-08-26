
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  user: {
    email: string;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== CONFIRMATION EMAIL FUNCTION STARTED ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    const payload: WebhookPayload = await req.json();
    console.log("Raw payload received:", JSON.stringify(payload, null, 2));
    
    const { user, email_data } = payload;

    console.log("=== EMAIL DATA EXTRACTED ===");
    console.log("User email:", user.email);
    console.log("Email action type:", email_data.email_action_type);
    console.log("Site URL:", email_data.site_url);
    console.log("Redirect to:", email_data.redirect_to);
    console.log("Token hash:", email_data.token_hash ? "Present" : "Missing");

    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key:", resendApiKey ? "Present" : "MISSING!");
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    // Build the proper Supabase confirmation URL with correct domain and correct query param
    const supabaseUrl = "https://tiqkfmokjrmoyytqmhat.supabase.co";
    const redirectTo = email_data.redirect_to || "https://thetranshumanismforum.lovable.app/";
    // IMPORTANT: Use token_hash param name (not 'token')
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(redirectTo)}`;

    console.log("=== CONFIRMATION URL GENERATED ===");
    console.log("Confirmation URL:", confirmationUrl);

    console.log("=== ATTEMPTING TO SEND EMAIL ===");
    const emailResponse = await resend.emails.send({
      from: "Transhumanism Forum <onboarding@resend.dev>",
      to: [user.email],
      subject: "Welcome to The Transhumanist Forum - Confirm Your Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to The Transhumanist Forum</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 40px 30px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">🧠 The Transhumanist Forum</div>
              <p style="margin: 0; opacity: 0.9;">Welcome to the future of human enhancement</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #333; margin-bottom: 20px;">Confirm Your Account</h2>
              <p style="margin-bottom: 20px;">Thank you for joining The Transhumanist Forum! Click the button below to confirm your email address and start exploring discussions about human enhancement, longevity, and the future of humanity.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; 
                          background: #6366f1; 
                          color: white; 
                          padding: 16px 32px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          font-weight: 600;">
                  Confirm Email Address
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #6366f1;">${confirmationUrl}</span>
              </p>
              
              <p style="color: #666; font-size: 14px;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa; text-align: center; color: #666; font-size: 14px;">
              <p style="margin: 0;">The Transhumanist Forum - Advancing Human Potential</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("=== EMAIL SENT SUCCESSFULLY ===");
    console.log("Email response:", JSON.stringify(emailResponse, null, 2));

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      recipient: user.email 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== EMAIL SENDING ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.constructor.name,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
