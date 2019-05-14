const SDK = require('ringcentral')
const dotenv = require('dotenv')

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
  var subscription = rcsdk.createSubscription()
  var eventFilters = [
    '/account/~/extension/~/message-store/instant?type=SMS',
    '/account/~/extension/~/voicemail'
  ]
  subscription
    .setEventFilters(eventFilters)
    .register()
    .then(response => {
      console.log("Waiting for notifications ...")
    })

  subscription.on(subscription.events.notification, function(msg){
    if (msg.event.indexOf('/message-store/instant') > -1) {
      console.log("Received a text message from: " + msg.body.from.phoneNumber)
      var message = 'This is an automatic reply. Thank you for your message!'
      sendReplySMS(message, msg.body.from.phoneNumber)
    }else if (msg.event.indexOf('/voicemail') > -1) {
      if (msg.body.from.hasOwnProperty("phoneNumber")){
        console.log("Received a voicemail from: " + msg.body.from.phoneNumber)
        var message = 'This is an automatic reply. Thank you for your voice message! I will get back to you asap.'
        sendReplySMS(message, msg.body.from.phoneNumber)
      }
    }else {
      console.log("Not an event we are waiting for.")
    }
  })
}).catch(e => {
  console.error(e)
})

function sendReplySMS(message, recipientNumber){
  platform.post('/account/~/extension/~/sms', {
    from: { phoneNumber: process.env.RINGCENTRAL_USERNAME },
    to: [
      { phoneNumber: recipientNumber }
    ],
    text: message
  }).then(response => {
    console.log('Replied message sent.')
  }).catch(e => {
    console.error(e)
  })
}
