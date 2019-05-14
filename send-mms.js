const SDK = require('ringcentral')
const dotenv = require('dotenv')
const FormData = require('form-data')

dotenv.config()

const rcsdk = new SDK({
    server: process.env.RINGCENTRAL_SERVER_URL,
    appKey: process.env.RINGCENTRAL_CLIENT_ID,
    appSecret: process.env.RINGCENTRAL_CLIENT_SECRET
})

const platform = rcsdk.platform()

platform.login({
    username: process.env.RINGCENTRAL_USERNAME,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD
}).then(response => {
    const formData = new FormData()
    const body = {
        from: { phoneNumber: process.env.RINGCENTRAL_USERNAME },
        to: [
            { phoneNumber: process.env.RINGCENTRAL_RECIPIENT }
        ],
        text: 'This is a test MMS from Node JS'
    }
    formData.append('body', Buffer.from( JSON.stringify(body) ), {
        filename: 'body.json',
        contentType: 'application/json'
    })
    formData.append('attachment', require('fs').createReadStream('test.jpg'))
    platform.post('/account/~/extension/~/sms', formData)
      .then(response => {
        var jsonObj = response.json()
        console.log('MMS sent. Message status: ' + jsonObj.messageStatus)
        //track_status(jsonObj.id, jsonObj.messageStatus)
      }).catch(e => {
          console.error(e)
      })
}).catch(e => {
    console.error(e)
})

function track_status(messageId, messageStatus){
    if (messageStatus == "Queued"){
      setTimeout(function(){
        platform.get(`/account/~/extension/~/message-store/${messageId}`)
          .then(response => {
            messageStatus = response.json().messageStatus
            var jsonObj = response.json()
            console.log("Message status: " + jsonObj.messageStatus)
            track_status(jsonObj.id, jsonObj.messageStatus)
          })
      }, 1000)
    }
}
