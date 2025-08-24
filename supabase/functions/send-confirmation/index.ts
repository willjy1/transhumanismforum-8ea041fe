import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  confirmation_url: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmation_url }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "The Transhumanist Forum <noreply@resend.dev>",
      to: [email],
      subject: "Welcome to The Transhumanist Forum - Confirm Your Account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Account</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; margin: 0;">
                  Welcome to The Transhumanist Forum
                </h1>
                <p style="color: #64748b; font-size: 16px; margin: 16px 0 0 0;">
                  Join the discussion on the future of humanity
                </p>
              </div>
              
              <div style="margin: 32px 0;">
                <p style="font-size: 16px; margin: 0 0 24px 0;">
                  Thank you for joining The Transhumanist Forum! To complete your registration and start participating in our community discussions, please confirm your email address.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${confirmation_url}" 
                     style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
                            color: white; 
                            text-decoration: none; 
                            padding: 16px 32px; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            font-size: 16px;
                            display: inline-block;
                            transition: all 0.2s;">
                    Confirm Your Email
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #64748b; margin: 24px 0 0 0;">
                  If the button above doesn't work, you can also copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #3b82f6; word-break: break-all; margin: 8px 0;">
                  ${confirmation_url}
                </p>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="font-size: 14px; color: #64748b; margin: 0;">
                  This confirmation link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                </p>
                
                <p style="font-size: 14px; color: #64748b; margin: 16px 0 0 0;">
                  Best regards,<br>
                  <strong>The Transhumanist Forum Team</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                © 2024 The Transhumanist Forum. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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