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
    const payload: WebhookPayload = await req.json();
    const { user, email_data } = payload;

    console.log("Sending confirmation email to:", user.email);

    // Build the proper Supabase confirmation URL with correct domain
    const supabaseUrl = "https://tiqkfmokjrmoyytqmhat.supabase.co";
    const redirectTo = email_data.redirect_to || "https://thetranshumanistforum.lovable.app/";
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(redirectTo)}`;

    console.log("Generated confirmation URL:", confirmationUrl);

    const emailResponse = await resend.emails.send({
      from: "The Transhumanist Forum <noreply@resend.dev>",
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

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);