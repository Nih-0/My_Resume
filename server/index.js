const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded photos locally
app.use('/uploads', express.static(UPLOADS_DIR));

const DATA_FILE = path.join(__dirname, 'data.json');
const JWT_SECRET = 'super-secret-key-for-portfolio';
let currentOtp = null;
let otpExpires = null;

const s3Client = new S3Client({
  forcePathStyle: true,
  region: 'ap-southeast-1',
  endpoint: 'https://frvjhjdzwxkqqpagocgy.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'da6680653bf7769b057eaccf0acb803c',
    secretAccessKey: '4f4194722cb8abf8a3f2c81a3729fe1dd3a0c3b2ce2d232daac801c0268b5183',
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rex8182004@gmail.com',
    pass: 'wirl cdzy znzb veqd'
  }
});

app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (email !== 'varunbb30@gmail.com') {
    return res.status(403).json({ error: 'Unauthorized email' });
  }

  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

  try {
    await transporter.sendMail({
      from: 'rex8182004@gmail.com',
      to: 'varunbb30@gmail.com',
      subject: 'Admin Portal OTP',
      text: `Your OTP for the portfolio admin portal is: ${currentOtp}`
    });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === currentOtp && Date.now() < otpExpires) {
    currentOtp = null;
    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid or expired OTP' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    next();
  });
};

app.post('/api/data', verifyToken, (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update data' });
  }
});

app.post('/api/upload-s3-photo', verifyToken, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const mimeMatch = image.match(/^data:(image\/\w+);base64,/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = contentType.split('/')[1] || 'jpg';
    
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const key = `profile_${Date.now()}.${ext}`;

    // Always save locally first so images are reliable even if Supabase is paused
    const localFilePath = path.join(UPLOADS_DIR, key);
    fs.writeFileSync(localFilePath, buffer);
    let publicUrl = `/uploads/${key}`;

    // Also attempt upload to S3 / Supabase if available
    try {
      const command = new PutObjectCommand({
        Bucket: 'portfolio',
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
      });
      await s3Client.send(command);
      publicUrl = `https://frvjhjdzwxkqqpagocgy.storage.supabase.co/storage/v1/object/public/portfolio/${key}`;
    } catch (s3Err) {
      console.warn('S3 / Supabase storage upload warning (using local upload fallback):', s3Err.message || s3Err);
    }

    res.json({ message: 'Photo uploaded successfully', url: publicUrl, key });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

app.delete('/api/delete-s3-photo', verifyToken, async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: 'No key provided' });

    // Delete local file if it exists
    const localFilePath = path.join(UPLOADS_DIR, key);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Attempt S3 deletion if available
    try {
      const command = new DeleteObjectCommand({
        Bucket: 'portfolio',
        Key: key
      });
      await s3Client.send(command);
    } catch (s3Err) {
      console.warn('S3 delete warning:', s3Err.message || s3Err);
    }

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

app.post('/api/upload-cv', verifyToken, async (req, res) => {
  try {
    const { file, fileName, fileType } = req.body;
    if (!file) return res.status(400).json({ error: 'No CV file provided' });

    const mimeMatch = file.match(/^data:([^;]+);base64,/);
    const contentType = fileType || (mimeMatch ? mimeMatch[1] : 'application/pdf');
    
    let ext = '.pdf';
    if (fileName && path.extname(fileName)) {
      ext = path.extname(fileName);
    } else if (contentType.includes('pdf')) {
      ext = '.pdf';
    } else if (contentType.includes('word') || contentType.includes('docx')) {
      ext = '.docx';
    } else if (contentType.includes('doc')) {
      ext = '.doc';
    }

    const base64Data = file.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeBaseName = (fileName ? path.basename(fileName, ext) : 'CV')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const key = `${safeBaseName}_${Date.now()}${ext}`;

    // Save locally
    const localFilePath = path.join(UPLOADS_DIR, key);
    fs.writeFileSync(localFilePath, buffer);
    let publicUrl = `/uploads/${key}`;

    // Attempt upload to S3 / Supabase if available
    try {
      const command = new PutObjectCommand({
        Bucket: 'portfolio',
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
      });
      await s3Client.send(command);
      publicUrl = `https://frvjhjdzwxkqqpagocgy.storage.supabase.co/storage/v1/object/public/portfolio/${key}`;
    } catch (s3Err) {
      console.warn('S3 CV storage upload warning (using local upload fallback):', s3Err.message || s3Err);
    }

    res.json({
      message: 'CV uploaded successfully',
      url: publicUrl,
      key,
      name: fileName || key,
      size: buffer.length,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('CV Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

app.delete('/api/delete-cv', verifyToken, async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: 'No key provided' });

    const localFilePath = path.join(UPLOADS_DIR, key);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: 'portfolio',
        Key: key
      });
      await s3Client.send(command);
    } catch (s3Err) {
      console.warn('S3 delete warning:', s3Err.message || s3Err);
    }

    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    console.error('Delete CV Error:', error);
    res.status(500).json({ error: 'Failed to delete CV' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Admin server running on port ${PORT}`);
});
