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
  var params = {
    from: { phoneNumber: process.env.RINGCENTRAL_USERNAME },
    to: [
      { phoneNumber: process.env.RINGCENTRAL_RECIPIENT }
    ],
    text: 'This is a test message from Node JS'
  }
  platform.post('/account/~/extension/~/sms', params)
    .then(response => {
      console.log('SMS sent: ' + response.json().messageStatus)
    }).catch(e => {
      console.error(e)
    })
}).catch(e => {
  console.error(e)
})