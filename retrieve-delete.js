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
  platform.get('/account/~/extension/~/message-store', {
    readStatus: 'Read'
  }).then(response => {
    var records = response.json().records
    console.log(`Retrieving a list of ${records.length} messages.`)
    for (var record of records) {
      platform.delete(`/account/~/extension/~/message-store/${record.id}`)
        .then(response => {
          console.log(`Message ${record.id} has been deleted.`)
        }).catch(e => {
          console.error(e)
        })
        break
    }
  }).catch(e => {
    console.error(e)
  })
}).catch(e => {
  console.error(e)
})
