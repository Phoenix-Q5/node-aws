const AWS = require('aws-sdk');
const Sharp = require('sharp');

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;

exports.handler = async (event) => {
    const { imageKey } = event;

    try {
        const image = await s3.getObject({ Bucket: bucketName, Key: imageKey }).promise();
        const thumbnail = await Sharp(image.Body).resize(200, 200).toBuffer();

        const thumbnailKey = imageKey.replace(/(\.[\w]+)$/, '-thumbnail$1');
        await s3.putObject({
            Bucket: bucketName,
            Key: thumbnailKey,
            Body: thumbnail,
            ContentType: 'image/jpeg'
        }).promise();

        return { thumbnailKey };
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
};
