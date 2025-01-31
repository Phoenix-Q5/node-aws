const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { imageKey } = event;

    try {
        const metadata = await s3.headObject({ Bucket: process.env.BUCKET_NAME, Key: imageKey }).promise();

        return {
            imageKey,
            metadata: {
                contentType: metadata.ContentType,
                size: metadata.ContentLength,
                lastModified: metadata.LastModified
            }
        };
    } catch (error) {
        console.error('Error extracting metadata:', error);
        throw error;
    }
};
