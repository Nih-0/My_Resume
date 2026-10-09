const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  forcePathStyle: true,
  region: 'ap-southeast-1',
  endpoint: 'https://frvjhjdzwxkqqpagocgy.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'da6680653bf7769b057eaccf0acb803c',
    secretAccessKey: '4f4194722cb8abf8a3f2c81a3729fe1dd3a0c3b2ce2d232daac801c0268b5183',
  }
});

async function testUpload() {
  try {
    const buffer = Buffer.from('test image content', 'utf8');
    const key = `test_${Date.now()}.txt`;
    const command = new PutObjectCommand({
      Bucket: 'portfolio',
      Key: key,
      Body: buffer,
      ContentType: 'text/plain',
      ACL: 'public-read'
    });
    await s3Client.send(command);
    console.log('Success! Public URL: https://frvjhjdzwxkqqpagocgy.storage.supabase.co/storage/v1/object/public/portfolio/' + key);
  } catch (e) {
    console.error('Error:', e);
  }
}
testUpload();
