const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function putFile(key, buffer, sanitizedFileName) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        Metadata: {
            'original-filename': sanitizedFileName
          }
    };

    // Upload file to S3 bucket
    const data = await s3.upload(params).promise();
    const fileUrl = data.Location;
    return fileUrl;
}

module.exports = {
    putFile
};