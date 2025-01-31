const awsMock = require('aws-sdk-mock');
const AWS = require('aws-sdk');
const { handler } = require('../handlers/createAnimal');

describe('createAnimal Lambda function', () => {
    beforeAll(() => {
        awsMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, { message: 'Success' });
        });
    });

    afterAll(() => {
        awsMock.restore('DynamoDB.DocumentClient');
    });

    it('should successfully create an animal', async () => {
        const event = {
            body: JSON.stringify({
                name: 'Elephant',
                species: 'Elephas',
                age: 10,
                description: 'Distinctive features of elephants include a long proboscis called a trunk, tusks, large ear flaps, pillar-like legs, and tough but sensitive grey skin. ',
                phylum: 'Chordata',
                genus: '',
                scientificName: 'Elephas maximus',
            }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.body).message).toBe('Animal created successfully');
    });

    it('should handle DynamoDB errors gracefully', async () => {
        awsMock.remock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(new Error('DynamoDB error'));
        });

        const event = {
            body: JSON.stringify({
                name: 'Elephant',
                species: 'Elephas',
                age: 10,
                description: 'Distinctive features of elephants include a long proboscis called a trunk, tusks, large ear flaps, pillar-like legs, and tough but sensitive grey skin. ',
                phylum: 'Chordata',
                genus: '',
                scientificName: 'Elephas maximus',
            }),
        };

        const response = await handler(event);
        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).error).toBe('Could not create animal');
    });
});
