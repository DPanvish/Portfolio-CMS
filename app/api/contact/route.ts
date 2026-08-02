import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Resend } from "resend";

// Initialize the Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// PUBLIC: Accept incoming messages and dispatch email notification
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Secure the transmission in the database
    const newMessage = await Message.create({
      name: body.name,
      email: body.email,
      message: body.message,
      portfolioSource: body.portfolioSource || "unknown",
    });

    // Dispatch the real-time email alert
    // Note: We use 'onboarding@resend.dev' as the sender for the free tier.
    // It will send directly to the ADMIN_EMAIL you specified in your .env
    await resend.emails.send({
      from: "Portfolio Command Center <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Transmission: ${body.name}`,
      reply_to: body.email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Incoming Transmission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #27272a;">
                      <span style="color: #f59e0b; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Command Center</span>
                      <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; margin: 12px 0 0 0; letter-spacing: -0.5px;">New Transmission</h1>
                    </td>
                  </tr>
                  
                  <!-- Meta Information Grid -->
                  <tr>
                    <td style="padding: 30px 40px 15px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="50%" style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px;">Initiator</p>
                            <p style="margin: 6px 0 0 0; font-size: 16px; color: #e4e4e7; font-weight: 500;">${body.name}</p>
                          </td>
                          <td width="50%" style="padding-bottom: 24px;">
                            <p style="margin: 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px;">Return Address</p>
                            <p style="margin: 6px 0 0 0; font-size: 16px; color: #e4e4e7; font-weight: 500;">
                              <a href="mailto:${body.email}" style="color: #f59e0b; text-decoration: none;">${body.email}</a>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%">
                            <p style="margin: 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px;">Target Vector</p>
                            <p style="margin: 6px 0 0 0; font-size: 14px; color: #a1a1aa;">${body.portfolioSource}</p>
                          </td>
                          <td width="50%">
                            <p style="margin: 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px;">Timestamp</p>
                            <p style="margin: 6px 0 0 0; font-size: 14px; color: #a1a1aa;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} (IST)</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Message Payload -->
                  <tr>
                    <td style="padding: 15px 40px 40px 40px;">
                      <p style="margin: 0 0 12px 0; font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px;">Decrypted Payload</p>
                      <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 24px;">
                        <p style="margin: 0; color: #d4d4d8; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${body.message}</p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 24px 40px; background-color: #18181b; border-top: 1px solid #27272a;">
                      <p style="margin: 0; font-size: 12px; color: #52525b; letter-spacing: 0.5px;">System architecture secure. You can reply directly to this email to respond.</p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
    
    return NextResponse.json({ success: true, id: newMessage._id }, { status: 201 });
    
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Failed to process transmission" }, { status: 500 });
  }
}

// SECURE: Fetch all messages (Only you can do this)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Fetch messages, newest first
    const messages = await Message.find().sort({ createdAt: -1 });
    
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}