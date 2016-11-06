## **Sample Alexa app - Personal Chef Assistance**
___

## **Overview**
This is a simple example of an Alexa app to use with Amazon Echo, to give you access to reciepies across the world.

* **MessageProvider.js** - A service that serves prompt message, reprompt and error messages. The messages are stored in `messages.json` to be make it easy to configure.
* **RecipeService.js** - A service that parses JSON data and data manipulation.   
* **index.js** contains the interface Amazon Alexa.
* **Messages.json and recipe.json** - stores the general messages that can be configured by developer.

## **Requirements**
___
Install NodeJS LTS (preferably v4.3.0, so it matches AWS Lambda).

	https://nodejs.org/en/download/

Then, install the Node dependencies using this command:
	***
	npm install
	***
Additionally, to test this app locally without using Amazon Echo / Alexa yet, do the following:

* Clone the project **alexa-app-server** from this Github repository: https://github.com/matt-kruse/alexa-app-server.
* From the project's root directory, install its dependencies:
	~~~
	npm install
	~~~
* Locate the folder **examples/apps** and copy the Chef project folder in it. You directory path should be **alexa-app-server/examples/apps/chef
* Go to the **alexa-app-server/examples** folder, and run this command to start the test server:
    ~~~
    node server
    ~~~
* With the server running, we can use it to test our Alexa app launch and intents. Go to this URL and play with it: **http://localhost:8080/alexa/chef**

## **Using with Amazon Echo / Alexa**
___
To use this app with an Alexa device, we need to do 2 things: Upload the app code to AWS Lambda, and create a new Alexa Skill in Amazon Alexa Service.

### Uploading to AWS Lambda
Create an AWS account in https://aws.amazon.com/. The Free Tier/Plan is good enough for this.

Create a new zip of the files that contain the code used by the app. This includes the **node_modules/** directory, since these are the packages that the app depends on. Files/Folders you need to package are:
* index.js
* datastore/
* services/
* node_modules/


First, we'll create an AWS role to run our Lambda function:
1. In AWS, go to the IAM console
2. Select "Roles" in the left menu
3. Click in "Create New Role"
4. Name your role as **lambda_basic_execution**
5. In Role Type screen, select "AWS Lambda"
6. In Attach Policy screen, use the filter textbox to find the role "AWSLambdaFullAccess" and select it
7. Complete the role creation.

Now, go to AWS Lambda console and do the following:
1. Click on **Create a Lambda Function**
2. Select the template **Blank Function** and click Next
3. In the trigger screen, click in the empty dotted space, and select **Alexa Skills Kit**. This will allow the Alexa Service to run the app in Lambda. Then next
4. Provide a name to the function, and set the field "Existing Role" to **lambda_basic_execution**
5. In the field "Code Entry Type", select option **Upload ZIP file** and upload the zip file we created before. Click next.
6. After the function has been created, look in the top-right of the screen for the **ARN** string. Copy this string.

### Creating a new Alexa Skill
1. Go to the page https://developer.amazon.com/, sign in with your Amazon account and click in **ALEXA** tab
2. Click in the option **Alexa Skills Kit -> Get started**
3. Click in **Add a new skill**
4. In the "Skill information" screen, provide a name and an invocation name. The invocation name is what the user will use to launch your Alexa app from the device.
5. In the "Interaction Model" screen, paste the **Intent Schema** and **Sample Utterances** that your Alexa skill will receive. You can obtain these from the **alexa-app-server** used during testing (check the "Requirements" section above about this).
6. In the "Configuration" screen, select the Endpoint type **AWS Lambda ARN**, with region "North America", and provide the ARN string copied from the Lambda console.

After this, your Alexa skill will be ready for testing. There is no need to continue with the Publishing setup, because now your registered Amazon Echo devices are able to connect to your Alexa skill.

The screen "Testing" in Alexa Skill Kit has an Alexa Simulator that helps testing your app without using an Echo device.
You can use it to listen how Alexa would say a response. Or enter an utterance defined in your Alexa skill to check that your Lambda function will run correctly when contacted by an Amazon Echo.
