const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    try {
        const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { name, species, age, description, phylum, genus, scientificName } = requestBody;

        if (!name || !species) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields: name or species' }),
            };
        }

        const animalItem = {
            AnimalID: AWS.util.uuid.v4(),
            Name: name,
            Species: species,
            Age: age || null,
            Description: description || null,
            Phylum: phylum || null,
            Genus: genus || null,
            ScientificName: scientificName || null,
            CreatedAt: new Date().toISOString(),
            Images: [],
        };

        const params = {
            TableName: tableName,
            Item: animalItem,
        };

        await dynamoDb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Animal created successfully', animal: animalItem }),
        };
    } catch (error) {
        console.error('Error creating animal:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not create animal', details: error.message }),
        };
    }
};