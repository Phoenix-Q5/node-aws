# Animalia App

Application built using serverless model. 

### Setup
* Import and run ```npm install``` to install the packages.
* Configure AWS environment in local using ```aws configure```.
* Optional - Install AWS ToolKit Extension in VS Code

### Run Tests
* AWS Mock SDK and Jest frameworks are used for unit tests.
* Use ```npx jest``` to run the test suite. 

### Services
* Used API Gateway to create rest endpoints and lambda functions are triggered for backend processing.
* DynamoDB serves as a backend database and Images are stored in AWS S3.
* All file shares are handled by Amazon EFS.

### AWS SAM CLI
* Utilized AWS SAM CLI for automated deployed.
* Run ```sam build``` to build the package
* Run ```sam deploy --guided``` to trigger deployment.

### Output Logs
* Logs folder is created to understand the commands, resource creations and development purposes. 
* These are NOT used for development of business logic, but only to understand resource usage and command outputs.

### Implemented git branch protection
* main branch is write protected. Please create feature branches and submit merge requests.