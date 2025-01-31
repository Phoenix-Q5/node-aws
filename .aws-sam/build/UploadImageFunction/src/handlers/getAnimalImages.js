const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3();

const tableName = process.env.TABLE_NAME;
const bucketName = process.env.BUCKET_NAME;

exports.handler = async (event) => {
    const { id } = event.pathParameters;

    const getParams = {
        TableName: tableName,
        Key: { AnimalID: id },
    };

    try {
        const result = await dynamoDb.get(getParams).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Animal not found' }),
            };
        }

        const images = result.Item.Images || [];
        const imagesWithUrls = images.map((image) => ({
            ...image,
            PreSignedUrl: s3.getSignedUrl('getObject', {
                Bucket: bucketName,
                Key: image.ImageKey,
                Expires: 300,
            }),
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(imagesWithUrls),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve images' }),
        };
    }
};