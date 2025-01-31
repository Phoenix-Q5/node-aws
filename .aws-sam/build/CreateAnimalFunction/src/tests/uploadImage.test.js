const awsMock = require('aws-sdk-mock');
const { handler } = require('../handlers/uploadImage');

describe('uploadImage Lambda function', () => {
    beforeAll(() => {
        awsMock.mock('S3', 'getSignedUrl', (operation, params, callback) => {
            callback(null, `https://mock-s3-url/${params.Key}`);
        });

        awsMock.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
            callback(null, { Attributes: {} });
        });
    });

    afterAll(() => {
        awsMock.restore('S3');
        awsMock.restore('DynamoDB.DocumentClient');
    });

    it('should generate a pre-signed URL and update DynamoDB', async () => {
        const event = {
            pathParameters: { id: 'animal-id' },
            body: JSON.stringify({ fileName: 'elephant.jpg', fileType: 'image/jpeg' }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('Upload URL generated and image metadata saved successfully');
        expect(body.uploadUrl).toContain('https://mock-s3-url/animal-id/elephant.jpg');
    });
});
