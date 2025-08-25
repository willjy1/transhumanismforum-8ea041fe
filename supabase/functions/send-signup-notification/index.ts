import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  userEmail: string;
  username?: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Signup notification function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, username, fullName }: SignupNotificationRequest = await req.json();
    console.log("Processing signup for:", userEmail);

    const emailResponse = await resend.emails.send({
      from: "Beyond Humanity <notifications@beyondhumanity.dev>",
      to: ["william@vivelajoye.com"],
      subject: "New User Signup - Beyond Humanity",
      html: `
        <h2>New User Registration</h2>
        <p>A new user has signed up for Beyond Humanity:</p>
        <ul>
          <li><strong>Email:</strong> ${userEmail}</li>
          ${username ? `<li><strong>Username:</strong> ${username}</li>` : ''}
          ${fullName ? `<li><strong>Full Name:</strong> ${fullName}</li>` : ''}
          <li><strong>Signup Time:</strong> ${new Date().toISOString()}</li>
        </ul>
        <p>You can view the user in your <a href="https://supabase.com/dashboard/project/tiqkfmokjrmoyytqmhat/auth/users">Supabase dashboard</a>.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
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