const awsMock = require('aws-sdk-mock');
const { handler } = require('../handlers/getAnimal');

describe('getAnimal Lambda function', () => {
    beforeAll(() => {
        awsMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
            if (params.Key.AnimalID === 'valid-id') {
                callback(null, { Item: { AnimalID: 'valid-id', Name: 'Siberian Tiger' } });
            } else {
                callback(null, {});
            }
        });
    });

    afterAll(() => {
        awsMock.restore('DynamoDB.DocumentClient');
    });

    it('should return animal details for a valid ID', async () => {
        const event = { pathParameters: { id: 'valid-id' } };

        const response = await handler(event);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body).Name).toBe('Siberian Tiger');
    });

    it('should return 404 for an invalid ID', async () => {
        const event = { pathParameters: { id: 'invalid-id' } };

        const response = await handler(event);
        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.body).error).toBe('Animal not found');
    });
});
