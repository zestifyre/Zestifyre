import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  restaurantName: string;
  email: string;
  customerName?: string;
}

export async function sendWelcomeEmail(data: EmailData) {
  try {
    const { restaurantName, email, customerName } = data;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Zestifyre</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
            .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Welcome to Zestifyre!</h1>
              <p>AI-Generated Menu Images for UberEats</p>
            </div>
            
            <div class="content">
              <h2>Hi ${customerName || 'there'}!</h2>
              
              <p>Thank you for your interest in Zestifyre! We're excited to help <strong>${restaurantName}</strong> boost their UberEats sales with professional AI-generated menu images.</p>
              
              <div class="highlight">
                <h3>🎯 What happens next?</h3>
                <ol>
                  <li><strong>Review your request</strong> - Our team will review your submission</li>
                  <li><strong>Create your sample</strong> - We'll generate a free watermarked preview</li>
                  <li><strong>Send you the sample</strong> - You'll receive it within 24-48 hours</li>
                  <li><strong>Purchase if you love it</strong> - Only pay if you're happy with the quality</li>
                </ol>
              </div>
              
              <h3>🚀 Why choose Zestifyre?</h3>
              <ul>
                <li>✅ <strong>Affordable</strong> - Professional quality at a fraction of traditional photography costs</li>
                <li>✅ <strong>Fast</strong> - Complete image sets in 24-48 hours</li>
                <li>✅ <strong>Tailored for UberEats</strong> - Optimized for delivery app requirements</li>
                <li>✅ <strong>No risk</strong> - Free samples before you buy</li>
              </ul>
              
              <p>We'll be in touch soon with your free sample image!</p>
              
              <p>Best regards,<br>
              The Zestifyre Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Zestifyre. All rights reserved.</p>
              <p>This email was sent to ${email} because you requested a free AI-generated menu image.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Welcome to Zestifyre!

Hi ${customerName || 'there'}!

Thank you for your interest in Zestifyre! We're excited to help ${restaurantName} boost their UberEats sales with professional AI-generated menu images.

What happens next?
1. Review your request - Our team will review your submission
2. Create your sample - We'll generate a free watermarked preview  
3. Send you the sample - You'll receive it within 24-48 hours
4. Purchase if you love it - Only pay if you're happy with the quality

Why choose Zestifyre?
✅ Affordable - Professional quality at a fraction of traditional photography costs
✅ Fast - Complete image sets in 24-48 hours
✅ Tailored for UberEats - Optimized for delivery app requirements
✅ No risk - Free samples before you buy

We'll be in touch soon with your free sample image!

Best regards,
The Zestifyre Team

© 2025 Zestifyre. All rights reserved.
This email was sent to ${email} because you requested a free AI-generated menu image.
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'admin@zestifyre.com',
      to: [email],
      subject: `Welcome to Zestifyre - Free Menu Image for ${restaurantName}`,
      html: emailHtml,
      text: emailText,
    });

    console.log('Email sent successfully:', result);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendSampleImageEmail(data: EmailData & { imageUrl: string }) {
  try {
    const { restaurantName, email, customerName, imageUrl } = data;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Free Sample Image is Ready!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
            .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .image-container { text-align: center; margin: 20px 0; }
            .image-container img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Sample Image is Ready!</h1>
              <p>Free AI-Generated Menu Image for ${restaurantName}</p>
            </div>
            
            <div class="content">
              <h2>Hi ${customerName || 'there'}!</h2>
              
              <p>Great news! Your free AI-generated menu image for <strong>${restaurantName}</strong> is ready. Here's your watermarked sample:</p>
              
              <div class="image-container">
                <img src="${imageUrl}" alt="Sample menu image for ${restaurantName}" />
              </div>
              
              <div class="highlight">
                <h3>💡 What's next?</h3>
                <p>If you love this sample and want the high-resolution, watermark-free version, simply reply to this email or contact us to place your order.</p>
                <p><strong>Pricing:</strong> $20-30 per image (no subscriptions, no hidden fees)</p>
              </div>
              
              <p>Questions? Just reply to this email - we're here to help!</p>
              
              <p>Best regards,<br>
              The Zestifyre Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Zestifyre. All rights reserved.</p>
              <p>This email was sent to ${email} because you requested a free AI-generated menu image.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'admin@zestifyre.com',
      to: [email],
      subject: `Your Free Sample Image is Ready - ${restaurantName}`,
      html: emailHtml,
    });

    console.log('Sample image email sent successfully:', result);
    return { success: true, messageId: result.data?.id };

  } catch (error) {
    console.error('Error sending sample image email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
