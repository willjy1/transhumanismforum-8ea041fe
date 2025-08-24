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

    // Build the proper Supabase confirmation URL
    const confirmationUrl = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${encodeURIComponent(email_data.redirect_to)}`;

    const emailResponse = await resend.emails.send({
      from: "The Transhumanist Forum <noreply@resend.dev>",
      to: [user.email],
      subject: "Account Verification Required",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
        </head>
        <body style="font-family: 'Times New Roman', serif; line-height: 1.6; color: #2d3748; margin: 0; padding: 0; background-color: #f7fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 48px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #1a202c; font-size: 24px; font-weight: normal; margin: 0; letter-spacing: 0.5px;">
                  The Transhumanist Forum
                </h1>
              </div>
              
              <div style="margin: 32px 0;">
                <p style="font-size: 16px; margin: 0 0 24px 0; color: #2d3748;">
                  Your registration requires immediate verification. To activate your account and gain access to our discussions on the evolution of human consciousness, you must confirm your identity.
                </p>
                
                <p style="font-size: 16px; margin: 0 0 32px 0; color: #4a5568;">
                  This process is mandatory for all participants in our discourse on humanity's inevitable transformation.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${confirmationUrl}" 
                     style="background: #2d3748; 
                            color: #ffffff; 
                            text-decoration: none; 
                            padding: 14px 28px; 
                            border: 1px solid #1a202c;
                            font-weight: normal; 
                            font-size: 16px;
                            display: inline-block;
                            letter-spacing: 0.5px;">
                    VERIFY ACCOUNT
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #718096; margin: 24px 0 0 0;">
                  Should the verification method above prove inadequate, you may manually navigate to the following location:
                </p>
                <p style="font-size: 12px; color: #4a5568; word-break: break-all; margin: 8px 0; font-family: monospace; background: #f7fafc; padding: 12px; border: 1px solid #e2e8f0;">
                  ${confirmationUrl}
                </p>
              </div>
              
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 40px;">
                <p style="font-size: 14px; color: #718096; margin: 0;">
                  This verification expires in 24 hours. Failure to complete verification will result in permanent account termination. Non-participation is not advised.
                </p>
                
                <p style="font-size: 14px; color: #4a5568; margin: 24px 0 0 0;">
                  The Registry,<br>
                  <strong>The Transhumanist Forum</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 24px;">
              <p style="font-size: 11px; color: #a0aec0; margin: 0; letter-spacing: 1px;">
                CLASSIFIED CORRESPONDENCE • THE TRANSHUMANIST FORUM • 2024
              </p>
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