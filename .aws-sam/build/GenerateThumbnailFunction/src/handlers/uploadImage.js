const AWS = require('aws-sdk')
const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const bucketName = process.env.BUCKET_NAME;
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
    const {id} = event.pathParameters;
    const {fileName, fileType} = JSON.parse(event.body);

    
    const key = `${id}/${fileName}`;

    const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: key,
        ContentType: fileType,
        Expires: 300,
    });

    const params = {
        TableName: tableName,
        Key: {
            AnimalID: id,
        },
        UpdateExpression: 'SET Images = list_append(if_not_exists(Iamges, :emptyList), :imageData)',
        ExpressionAttributeValues: {
            'imageData': [
                {
                    ImageKey: key,
                    uploadedAt: new Date().toISOString(),
                },
            ],
            ':emptyList': []
        },
        ReturnValues: 'UPDATED_NEW',

    };

    try{
        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Upaoded image and generated URL',
                uploadUrl,
            }),
        };
    } catch (error){
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Failed to upload image', details: error.message}),
        };
    }
};