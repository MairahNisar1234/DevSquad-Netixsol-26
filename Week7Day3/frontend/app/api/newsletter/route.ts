import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('\n--- 🛡️ Newsletter Request Received ---');
  
  try {
    // 1. Parse and Validate Payload
    const body = await req.json().catch(() => null);
    console.log('📦 Payload:', body);

    if (!body || !body.email) {
      console.error('❌ Error: Empty or malformed body');
      return NextResponse.json({ error: 'Payload missing' }, { status: 400 });
    }

    const email = body.email.trim();
    const apiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_LIST_ID || '1');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error(`❌ Error: Invalid format [${email}]`);
      return NextResponse.json({ error: 'Invalid email format' }, { status: 422 });
    }

    if (!apiKey) {
      console.error('❌ Error: BREVO_API_KEY is missing in .env.local');
      return NextResponse.json({ error: 'Service Unavailable' }, { status: 503 });
    }

    // 2. Check if Contact Exists (Avoid Duplicates)
    console.log(`🔍 Checking if ${email} exists in Brevo...`);
    const checkResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'accept': 'application/json', 'api-key': apiKey },
    });

    if (checkResponse.ok) {
      const contactData = await checkResponse.json();
      if (contactData.listIds?.includes(listId)) {
        console.warn(`⚠️ Warning: ${email} is already in List ID ${listId}`);
        return NextResponse.json({ message: 'Already Subscribed', isExisting: true }, { status: 200 });
      }
      console.log('ℹ️ Contact exists but not in this list. Updating...');
    }

    // 3. Add/Update Contact in List
    console.log(`🚀 Adding ${email} to List ID: ${listId}`);
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!contactResponse.ok) {
      const contactError = await contactResponse.json();
      console.error('❌ Brevo Contact API Error:', contactError);
      return NextResponse.json({ error: contactError.message || 'Failed to add contact' }, { status: contactResponse.status });
    }

    // 4. Trigger Transactional Welcome Email (The "Instant Message" Fix)
    console.log(`📧 Sending Welcome Email to ${email}...`);
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: "Circlechain", email: "mairahnisar4@gmail.com" }, // Must be a verified sender in Brevo
        to: [{ email: email }],
        subject: "Welcome to the Circlechain Community!",
        htmlContent: `
          <div style="font-family: 'Montserrat', sans-serif; background-color: #020617; color: #ffffff; padding: 50px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(46, 213, 115, 0.3); padding: 30px; border-radius: 20px;">
              <h1 style="color: #2ED573; font-size: 28px;">Welcome to the Circle!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                Thank you for subscribing to Circlechain. You're now on the list to receive the latest updates, 
                insights, and exclusive news directly in your inbox.
              </p>
              <div style="margin: 30px 0;">
                <span style="background: #2ED573; color: #020617; padding: 12px 25px; border-radius: 50px; font-weight: bold; text-decoration: none;">
                  Subscription Confirmed
                </span>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
                © 2026 Circlechain. All rights reserved.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const emailStatus = emailResponse.status;
    console.log(`📡 SMTP Response Status: ${emailStatus}`);

    if (emailResponse.ok) {
      console.log('✅ Success: Contact added and Welcome Email sent');
      return NextResponse.json({ message: 'Success', isExisting: false }, { status: 200 });
    } else {
      const emailError = await emailResponse.json();
      console.warn('⚠️ Contact added, but Email delivery failed:', emailError);
      // We still return 200 because the user IS subscribed, but we log the email failure
      return NextResponse.json({ message: 'Subscribed (Email Delivery Pending)', isExisting: false }, { status: 200 });
    }

  } catch (error: any) {
    console.error('💥 CRITICAL FAILURE:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    console.log('--- 🛡️ Request Lifecycle End ---\n');
  }
}