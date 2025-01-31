const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const { animalId, imageKey, metadata } = event;

    try {
        await dynamoDb.update({
            TableName: tableName,
            Key: { AnimalID: animalId },
            UpdateExpression: 'SET Images = list_append(if_not_exists(Images, :emptyList), :imageData)',
            ExpressionAttributeValues: {
                ':imageData': [
                    {
                        ImageKey: imageKey,
                        Metadata: metadata
                    }
                ],
                ':emptyList': []
            }
        }).promise();

        return { message: 'Metadata updated successfully' };
    } catch (error) {
        console.error('Error updating metadata:', error);
        throw error;
    }
};
