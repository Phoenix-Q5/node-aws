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
        const result = await dynamoDb.get(params).promise();

        if(!result.item){
            return{
                statusCode: 404,
                body: JSON.stringify({error: 'Animal not found'}),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(result.item),
        };
    }catch (error){
        return{
            statusCode: 500,
            body: JSON.stringify({error: 'Error fetching animal', details: error.message}),
        };
    }

};