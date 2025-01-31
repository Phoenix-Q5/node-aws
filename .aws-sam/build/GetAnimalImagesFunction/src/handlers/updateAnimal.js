const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const id = event.pathParameters;
    const {name, species, age, description, phylum, genus, scientificName} = JSON.parse(event.body);

    const params = {
        TableName: 'Animals',
        Key: {
            AnimalID: id,
        },
        UpdateExpression: 'SET #name = :name, #species = :species, #age = :age, #description = :description, #phylum=:phylum, #genus=:genus, #scientificName=:scientificName. #images = if_not_exists(#images,:emptyList)',
        ExpressionAttributeNames: {
            '#name': 'Name',
            '#species': 'Species',
            '#age' : 'Age',
            '#description' :'Description',
            '#phylum' :'Phylum',
            '#genus': 'Genus',
            '#scientificName' :'ScientificName',
            '#images': 'Images'
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':species': species,
            ':age': age,
            ':description': description,
            ':phylum': phylum,
            ':genus': genus,
            ':scientificName': scientificName,
            ':emptyList': []
        },
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Animal updated successfully',
                updatedAttributes: result.Attributes,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Error updating animal'}),
        };
    }

};