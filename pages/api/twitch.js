// This is where all the logic for your Twitch API will live!
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  console.log('TWITCH ENDPOINT')
    try {
      if (req.method === 'POST') {
        console.log('POST ON TWITCH ENDPOINT')
        const { data } = req.body
        console.log('DATA: ', data)
        const channelData = await getTwitchChannel(data)
        if (channelData) {
          res.status(200).json({ channelData })
        }
        res.status(404).send()
      }
    } catch (error) {
      console.warn(error.message)
      res.status(500).send()
    }
  }
  
  //Actions
  const getTwitchAccesToken = async () => {
   
    const path = `https://id.twitch.tv/oauth2/token?client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_TWITCH_SECRET_ID}&grant_type=client_credentials`

    const response = await fetch(path, {
      method: 'POST'
    })
  
    if (response) {
      const json = await response.json()
      return json.access_token
    }
  }
  
  const getTwitchChannel = async  channelName => {

    console.log('GET TWITCH CHANNEL')
    if(channelName){
      //Get acces token
      const accesToken = await getTwitchAccesToken()
      console.log('ACCES TOKEN', accesToken)
  
      if(accesToken) {
        //Make query request

        console.log('MAKING SEARCH ON API TWITCH')

        const response = await fetch(`https://api.twitch.tv/helix/search/channels?query=${channelName}`, {
          headers: {
            Authorization: `Bearer ${accesToken}`,
            "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID
          }
        })
  
        const json = await response.json()
        if(json.data){
          const {data} = json
  
          
          const lowercaseChannelName = channelName.toLowerCase()
  
          const foundChannel = data.find(channel => {
            const lowercaseDisplayName = channel.display_name.toLowerCase()
            return lowercaseChannelName === lowercaseDisplayName
          })
          return foundChannel
        }
      }
      
      throw new Error("Twitch accesToken was undefined")
    }
    throw new Error('No channelName provided')
  }