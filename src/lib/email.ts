import nodemailer from 'nodemailer'

// Create reusable transporter (optional - email notifications)
function getTransporter() {
  // Skip if SMTP not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, email notifications disabled')
    return null
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
    })
  } catch (error) {
    console.error('Failed to create email transporter:', error)
    return null
  }
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const transporter = getTransporter()
    
    if (!transporter) {
      console.log('Email skipped (SMTP not configured)')
      return { success: false, error: 'SMTP not configured' }
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'dibeli.my.id <noreply@dibeli.my.id>',
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    // Don't throw, just log and return
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Welcome email template
export async function sendWelcomeEmail(email: string, name: string, trialEndDate: Date) {
  const daysLeft = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .feature-item { padding: 10px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Selamat Datang di dibeli.my.id!</h1>
      <p>Halo ${name || 'Sobat Seller'},</p>
    </div>
    
    <div class="content">
      <p>Terima kasih sudah mendaftar di <strong>dibeli.my.id</strong>! 🚀</p>
      
      <p>Akun Anda sudah aktif dengan <strong>FREE TRIAL ${daysLeft} hari</strong>. Saatnya buat toko online impian Anda!</p>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://dibeli-platform.vercel.app'}/dashboard" class="button">
          Buat Toko Sekarang
        </a>
      </div>
      
      <div class="features">
        <h3>✨ Apa yang bisa Anda lakukan?</h3>
        
        <div class="feature-item">
          <strong>⚡ Setup 10 Menit</strong><br>
          Buat toko online profesional tanpa coding!
        </div>
        
        <div class="feature-item">
          <strong>🎨 30+ Template Premium</strong><br>
          Pilih template, customize, dan langsung live!
        </div>
        
        <div class="feature-item">
          <strong>💬 WhatsApp Integration</strong><br>
          Customer langsung chat WhatsApp untuk order.
        </div>
        
        <div class="feature-item">
          <strong>☁️ Storage Gratis</strong><br>
          Upload foto ke Google Drive Anda sendiri.
        </div>
        
        <div class="feature-item">
          <strong>📱 Mobile Responsive</strong><br>
          Otomatis perfect di semua device!
        </div>
      </div>
      
      <h3>🎯 Langkah Selanjutnya:</h3>
      <ol>
        <li>Login ke dashboard Anda</li>
        <li>Klik "Buat Toko" dan isi informasi dasar</li>
        <li>Tambahkan produk pertama Anda</li>
        <li>Pilih template yang Anda suka</li>
        <li>Publish dan mulai jualan! 🎉</li>
      </ol>
      
      <p><strong>💎 Upgrade ke Premium (Rp 49k/bulan)</strong></p>
      <ul>
        <li>✓ Unlimited produk</li>
        <li>✓ Semua template</li>
        <li>✓ Custom warna & branding</li>
        <li>✓ Tanpa watermark</li>
        <li>✓ Priority support</li>
      </ul>
      
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <strong>⏰ Trial Anda akan berakhir pada:</strong><br>
        ${trialEndDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      
      <p>Butuh bantuan? Reply email ini atau hubungi support kami!</p>
      
      <p>Selamat berjualan! 🚀</p>
      
      <p>
        Salam hangat,<br>
        <strong>Tim dibeli.my.id</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 dibeli.my.id - Platform Toko Online Indonesia</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #666;">Privacy Policy</a> | 
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #666;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Selamat Datang di dibeli.my.id!

Halo ${name || 'Sobat Seller'},

Terima kasih sudah mendaftar! Akun Anda sudah aktif dengan FREE TRIAL ${daysLeft} hari.

Mulai sekarang:
1. Login ke dashboard
2. Buat toko pertama Anda
3. Tambahkan produk
4. Pilih template
5. Publish dan mulai jualan!

Trial berakhir: ${trialEndDate.toLocaleDateString('id-ID')}

Visit: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Salam,
Tim dibeli.my.id
  `

  return sendEmail({
    to: email,
    subject: '🎉 Selamat Datang di dibeli.my.id - Trial 14 Hari Aktif!',
    html,
    text,
  })
}

// Trial expiring reminder (3 days before)
export async function sendTrialExpiringEmail(email: string, name: string, daysLeft: number) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #9333ea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .warning { background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Trial Anda Segera Berakhir</h1>
      <p>Halo ${name},</p>
    </div>
    
    <div class="content">
      <div class="warning">
        <strong>⚠️ Trial Anda akan berakhir dalam ${daysLeft} hari!</strong><br>
        Upgrade sekarang untuk tetap menggunakan semua fitur.
      </div>
      
      <p>Jangan kehilangan toko online Anda! Upgrade ke <strong>Premium</strong> hanya <strong>Rp 49k/bulan</strong>.</p>
      
      <h3>💎 Keuntungan Premium:</h3>
      <ul>
        <li>✓ Unlimited produk (Trial hanya 3)</li>
        <li>✓ Akses semua template premium</li>
        <li>✓ Custom warna & branding</li>
        <li>✓ Tanpa watermark dibeli.my.id</li>
        <li>✓ Priority support via WhatsApp</li>
        <li>✓ Analytics lengkap</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings" class="button">
          Upgrade ke Premium
        </a>
      </div>
      
      <p><strong>🎁 Special Offer:</strong> Upgrade sekarang dan dapatkan diskon 20% untuk bulan pertama!</p>
      
      <p>Pertanyaan? Hubungi kami via email atau WhatsApp.</p>
      
      <p>
        Salam,<br>
        <strong>Tim dibeli.my.id</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 dibeli.my.id - Platform Toko Online Indonesia</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: `⏰ Trial Berakhir ${daysLeft} Hari Lagi - Upgrade Sekarang!`,
    html,
    text: `Trial Anda akan berakhir dalam ${daysLeft} hari. Upgrade ke Premium (Rp 49k/bulan) sekarang!`,
  })
}

// Store published notification
export async function sendStorePublishedEmail(email: string, storeName: string, storeSlug: string) {
  const storeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/toko/${storeSlug}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fb923c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .success { background: #d1fae5; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; text-align: center; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Toko Anda Sudah LIVE!</h1>
    </div>
    
    <div class="content">
      <div class="success">
        <h2 style="color: #059669; margin: 0;">✅ ${storeName} Sudah Online!</h2>
      </div>
      
      <p>Selamat! Toko online Anda sudah bisa diakses oleh customer di seluruh dunia! 🌍</p>
      
      <h3>🔗 URL Toko Anda:</h3>
      <p style="background: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px;">
        <strong><a href="${storeUrl}" style="color: #9333ea;">${storeUrl}</a></strong>
      </p>
      
      <div style="text-align: center;">
        <a href="${storeUrl}" class="button">
          Lihat Toko Anda
        </a>
      </div>
      
      <h3>📣 Langkah Selanjutnya:</h3>
      <ol>
        <li><strong>Share link toko</strong> ke social media Anda</li>
        <li><strong>Tambahkan ke Instagram bio</strong> atau TikTok</li>
        <li><strong>Promosikan via WhatsApp Status</strong></li>
        <li><strong>Ajak teman & keluarga</strong> untuk cek toko Anda</li>
        <li><strong>Monitor views</strong> di dashboard</li>
      </ol>
      
      <h3>💡 Tips Meningkatkan Penjualan:</h3>
      <ul>
        <li>✓ Upload foto produk berkualitas tinggi</li>
        <li>✓ Tulis deskripsi produk yang menarik</li>
        <li>✓ Update produk secara rutin</li>
        <li>✓ Respon cepat customer via WhatsApp</li>
        <li>✓ Share testimoni customer di social media</li>
      </ul>
      
      <p>Semangat berjualan! 🚀</p>
      
      <p>
        Salam sukses,<br>
        <strong>Tim dibeli.my.id</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 dibeli.my.id - Platform Toko Online Indonesia</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject: `🎉 ${storeName} Sudah Live! Mulai Jualan Sekarang`,
    html,
    text: `Toko ${storeName} sudah online! Kunjungi: ${storeUrl}`,
  })
}
