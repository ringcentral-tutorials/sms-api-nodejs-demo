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
    readStatus: 'Unread'
  }
  platform.get('/account/~/extension/~/message-store', params)
    .then(response => {
      var records = response.json().records
      console.log(`Retrieving a list of ${records.length} messages.`)
      for (var record of records) {
        platform.put(`/account/~/extension/~/message-store/${record.id}`, {
          readStatus: 'Read'
        }).then(response => {
          console.log(`Message status has been changed to ${response.json().readStatus}`)
        }).catch(e => {
          console.error(e)
        })
      }
    }).catch(e => {
      console.error(e)
    })
}).catch(e => {
  console.error(e)
})
