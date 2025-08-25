import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== EMAIL TEST FUNCTION STARTED ===");
    
    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    console.log("Resend API key:", resendApiKey ? "Present" : "MISSING!");
    
    if (!resendApiKey) {
      return new Response(JSON.stringify({ 
        error: "RESEND_API_KEY environment variable is not set",
        success: false 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resend = new Resend(resendApiKey);
    
    const { email } = await req.json();
    const testEmail = email || "test@example.com";
    
    console.log("Sending test email to:", testEmail);
    
    const emailResponse = await resend.emails.send({
      from: "The Transhumanist Forum <noreply@resend.dev>",
      to: [testEmail],
      subject: "Email Test - The Transhumanist Forum",
      html: `
        <h1>Email Test Successful!</h1>
        <p>This is a test email from The Transhumanist Forum.</p>
        <p>If you received this, the Resend integration is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.data?.id,
      recipient: testEmail,
      response: emailResponse
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("=== EMAIL TEST ERROR ===");
    console.error("Error:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      type: error.constructor.name
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);