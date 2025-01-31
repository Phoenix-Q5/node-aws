const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {name, species, age, description, phylum, genus, scientificName } = JSON.parse(event.body);

    const params = {
        TableName: 'Animals',
        Items: {
            AnimalID: AWS.util.uuid.v4(),
            Name: name,
            Species: species,
            Age: age,
            Description: description,
            Phylum: phylum,
            Genus: genus,
            ScientificName: scientificName,
            CreatedAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({message: 'Animal created successfully'}),
        };
    } catch (error){
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Animal upload failed!'}),
        };
    }
};