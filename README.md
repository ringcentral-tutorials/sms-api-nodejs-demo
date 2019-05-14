# SMS Application Walk-through

Welcome to the SMS Application Walk-through and tour of a fully functional SMS application powered by RingCentral. In this walk through you will learn:

- How to send an SMS message
- How to send an MMS message
- How to track delivery status of messages
- How to modify the message's read status.
- How to delete a message.
- How to receive and reply to SMS messages

### Clone - Setup - Run the project
```
$ git clone https://github.com/ringcentral-tutorials/sms-api-nodejs-demo
$ cd sms-api-nodejs-demo
$ npm install --save
```

Specify your app client id and client secret as well as account login credentials to the constant defined within the brackets "< >".

#### How to send SMS
```
$ node send-sms.js
```

#### How to send MMS
```
$ node send-mms.js
```

#### How to track delivery status of messages
Uncomment the function call below and run the app
```
//track_mms();
$ node send-mms.js
```

#### How to retrieve and modify message's read status
```
$ node retrieve-modify.js
```
#### How to delete messages

```
$ node retrieve-delete.js
```

#### How to receive and reply to SMS messages
```
$ node receive-reply.js
```

## RingCentral Node JS SDK
The SDK is available at https://github.com/ringcentral/ringcentral-js
