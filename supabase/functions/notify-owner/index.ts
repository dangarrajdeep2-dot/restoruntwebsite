// ====================================================================
// supabase/functions/notify-owner/index.ts
// Edge Function triggered by Database Webhook or invoked directly
// sends owner email via Resend and formats instant WhatsApp alerts
// ====================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  type: "INSERT" | "UPDATE";
  table: "orders" | "reservations" | "enquiries";
  record: any;
  old_record?: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    const { table, record } = payload;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "reservations@nandanvanrajkot.com";
    const OWNER_WHATSAPP = Deno.env.get("OWNER_WHATSAPP") || "+919825084721";

    let subject = "";
    let htmlContent = "";
    let whatsappText = "";

    // 1. ORDER NOTIFICATION
    if (table === "orders") {
      subject = `🍽️ New Order Received: #${record.order_number} (₹${record.total})`;
      whatsappText = `*Nandanvan Restaurant - New Order Alert!*\n\n` +
        `*Order #:* ${record.order_number}\n` +
        `*Customer:* ${record.customer_name}\n` +
        `*Phone:* ${record.phone}\n` +
        `*Type:* ${record.order_type.toUpperCase()}\n` +
        `*Total:* ₹${record.total}\n` +
        `*Payment:* ${record.payment_method}\n` +
        (record.address ? `*Address:* ${record.address}\n` : "") +
        (record.notes ? `*Notes:* ${record.notes}\n` : "") +
        `*Status:* ${record.status}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; background: #0E2A1F; color: #FFF6E5; padding: 24px; border-radius: 8px;">
          <h2 style="color: #D4A24C; margin-top: 0;">✨ New Order Alert: #${record.order_number}</h2>
          <p><strong>Customer:</strong> ${record.customer_name}</p>
          <p><strong>Phone:</strong> <a href="tel:${record.phone}" style="color: #D4A24C;">${record.phone}</a></p>
          <p><strong>Order Type:</strong> ${record.order_type}</p>
          <p><strong>Total Amount:</strong> ₹${record.total}</p>
          <p><strong>Payment Method:</strong> ${record.payment_method}</p>
          ${record.address ? `<p><strong>Delivery Address:</strong> ${record.address}</p>` : ""}
          ${record.notes ? `<p><strong>Special Instructions:</strong> ${record.notes}</p>` : ""}
          <p style="margin-top: 20px;">
            <a href="https://wa.me/${record.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(record.customer_name)},%20your%20order%20%23${record.order_number}%20at%20Nandanvan%20is%20confirmed!" style="background: #25D366; color: white; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Open Customer WhatsApp
            </a>
          </p>
        </div>
      `;
    }
    // 2. RESERVATION NOTIFICATION
    else if (table === "reservations") {
      subject = `🍷 New Table Reservation: ${record.name} (${record.guests} Guests)`;
      whatsappText = `*Nandanvan Restaurant - Table Reservation Alert!*\n\n` +
        `*Name:* ${record.name}\n` +
        `*Date:* ${record.date}\n` +
        `*Time:* ${record.time}\n` +
        `*Guests:* ${record.guests} People\n` +
        `*Table Type:* ${record.table_type}\n` +
        `*Occasion:* ${record.occasion || 'Casual'}\n` +
        `*Phone:* ${record.phone}\n` +
        (record.special_request ? `*Special Request:* ${record.special_request}\n` : "");

      htmlContent = `
        <div style="font-family: Arial, sans-serif; background: #0E2A1F; color: #FFF6E5; padding: 24px; border-radius: 8px;">
          <h2 style="color: #D4A24C; margin-top: 0;">🍷 New Table Booking Request</h2>
          <p><strong>Guest Name:</strong> ${record.name}</p>
          <p><strong>Phone:</strong> <a href="tel:${record.phone}" style="color: #D4A24C;">${record.phone}</a></p>
          <p><strong>Date & Time:</strong> ${record.date} at ${record.time}</p>
          <p><strong>Party Size:</strong> ${record.guests} Guests (${record.table_type})</p>
          <p><strong>Occasion:</strong> ${record.occasion}</p>
          ${record.special_request ? `<p><strong>Special Request:</strong> ${record.special_request}</p>` : ""}
          <p style="margin-top: 20px;">
            <a href="https://wa.me/${record.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(record.name)},%20your%20table%20reservation%20at%20Nandanvan%20for%20${record.date}%20at%20${record.time}%20is%20confirmed!" style="background: #25D366; color: white; padding: 10px 18px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Confirm to Guest on WhatsApp
            </a>
          </p>
        </div>
      `;
    }
    // 3. ENQUIRIES NOTIFICATION
    else if (table === "enquiries") {
      subject = `🎉 New Event / Catering Enquiry: ${record.name} (${record.event_type})`;
      whatsappText = `*Nandanvan Restaurant - New Banquet & Catering Enquiry!*\n\n` +
        `*Name:* ${record.name}\n` +
        `*Phone:* ${record.phone}\n` +
        `*Event Type:* ${record.event_type}\n` +
        `*Event Date:* ${record.event_date}\n` +
        (record.guests ? `*Est. Guests:* ${record.guests}\n` : "") +
        `*Message:* ${record.message}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; background: #0E2A1F; color: #FFF6E5; padding: 24px; border-radius: 8px;">
          <h2 style="color: #D4A24C; margin-top: 0;">🎉 New Banquet / Catering Enquiry</h2>
          <p><strong>Contact Name:</strong> ${record.name}</p>
          <p><strong>Phone:</strong> <a href="tel:${record.phone}" style="color: #D4A24C;">${record.phone}</a></p>
          <p><strong>Event:</strong> ${record.event_type} on ${record.event_date}</p>
          ${record.guests ? `<p><strong>Expected Guests:</strong> ${record.guests}</p>` : ""}
          <p><strong>Message / Requirements:</strong> ${record.message}</p>
        </div>
      `;
    }

    // Send email using Resend if API key is present
    let emailSent = false;
    if (RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Nandanvan Alerts <notifications@nandanvanrajkot.com>",
            to: [OWNER_EMAIL],
            subject: subject,
            html: htmlContent,
          }),
        });
        emailSent = res.ok;
      } catch (err) {
        console.error("Failed to send Resend email:", err);
      }
    }

    const whatsappDeepLink = `https://wa.me/${OWNER_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`;

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        whatsappText,
        whatsappDeepLink,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
