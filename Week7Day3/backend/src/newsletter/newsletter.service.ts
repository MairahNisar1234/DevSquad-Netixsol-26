import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger('NEWSLETTER_DEBUG');
  private readonly BREVO_API_URL = 'https://api.brevo.com/v3';

  async subscribe(email: string) {
    console.log('\n--- 🛡️ [START] Newsletter Subscription ---');
    console.log(`📧 Target Email: ${email}`);

    try {
      // Step 1: Add to Contacts
      await this.addToBrevoContacts(email);

      // Step 2: Send Confirmation Email
      await this.sendConfirmationEmail(email);

      console.log('✅ [COMPLETE] Entire flow finished successfully\n');
      return { success: true, message: 'Subscription successful' };
    } catch (error: any) {
      console.error('💥 [CRITICAL FAILURE]:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async addToBrevoContacts(email: string) {
    console.log('🔍 [STEP 1] Adding contact to Brevo list...');
    
    const response = await fetch(`${this.BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [2],
        updateEnabled: true,
      }),
    });

    const rawResponse = await response.text();
    console.log(`📡 Brevo Contacts API Status: ${response.status}`);
    console.log(`📦 Brevo Contacts Raw Body: ${rawResponse}`);

    if (!response.ok) {
      throw new Error(`Contacts API failed with status ${response.status}`);
    }
  }

  private async sendConfirmationEmail(email: string) {
    console.log('📧 [STEP 2] Attempting to fire SMTP Welcome Email...');

    const response = await fetch(`${this.BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Web3 Platform', email: 'mairahnisar4@gmail.com' },
        to: [{ email }],
        subject: 'Welcome!',
        templateId: 1, 
      }),
    });

    const rawResponse = await response.text();
    console.log(`📡 Brevo SMTP API Status: ${response.status}`);
    console.log(`📦 Brevo SMTP Raw Body: ${rawResponse}`);

    if (!response.ok) {
       throw new Error(`SMTP API failed with status ${response.status}`);
    }
  }
}