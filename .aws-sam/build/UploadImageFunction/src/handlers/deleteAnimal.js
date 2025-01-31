const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {id} = event.pathParameters;

    const params = {
        TableName: 'Animals',
        Key: {
            AnimalID: id,
        },
    };

    try {
        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Animal deleted successfully'}),
        };
    } catch (error) {
        return {
        statusCode: 500,
        body: JSON.stringify({error: 'Animal deletion failed'}),
        };
    }

};