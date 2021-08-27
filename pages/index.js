// Main entry point of your app
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import StreamerGrid from "../components/StreamerGrid";

const Home = () => {
  let path;

  //State
  const [favoriteChannels, setFavoriteChannels] = useState([]);

  //Effects
  useEffect(() => {
    path = `https://${window.location.hostname}:3000`
  },[])

  useEffect(() => {
    fetchChannels()
  }, []);

  // Actions

  const fetchChannels = async () => {
    try {
      //Get keys from db
      const response = await fetch(`${path}/api/database`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'GET_CHANNELS',
          key: 'CHANNELS',
        })
      })

      if (response.status === 404) {
        console.log('Chanels key could not be found')
      }

      const json = await response.json()

      

      if (json.data) {
        const channelNames = json.data.split(',')

        //Get twitch data and set in channels State
        const channelData = []

        for await (let channelName of channelNames) {
          const channelResp = await fetch(`${path}/api/twitch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: channelName })
          })

          const json = await channelResp.json()

          if (json.channelData) {
            channelData.push(json.channelData)
          }
        }
        setFavoriteChannels(channelData)
      }

    } catch (error) {
      console.warn(error.message)
    }
  }



  const setChannel = async (channelName) => {
    try {
      //Get all the current streamers names in the list
      const currentStreamers = favoriteChannels.map((channel) =>
        channel.display_name.toLowerCase()
      );

      const streamerList = [...currentStreamers, channelName].join(",");



      const response = await fetch(`${path}/api/database`, {
        method: "POST",
        body: JSON.stringify({
          key: "CHANNELS",
          value: streamerList,
        }),
      });

      if (response.status === 200) {
        console.log(`Set ${channelName} in db`);
      }
    } catch (error) {
      console.warn(error.message);
    }
  };

  const addStreamChannel = async (event) => {
    // Prevent the page from redirecting
    event.preventDefault();

    const { value } = event.target.elements.name;

    if (value) {
      // Call Twitch Search API
      const response = await fetch(`${path}/api/twitch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: value }),
      });

      const json = await response.json();

      setFavoriteChannels((prevState) => [...prevState, json.channelData]);

      await setChannel(value);
      event.target.elements.name.value = "";
    }
  };

  //Render methods
  const renderForm = () => {
    return (
      <div className={styles.formContainer}>
        <form onSubmit={addStreamChannel}>
          <input
            id="name"
            placeholder="Twitch Channel Name"
            type="text"
            required
          />
          <button type="sumbit">Add Streamer</button>
        </form>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>
        {renderForm()}
        <StreamerGrid
          channels={favoriteChannels}
          setChannels={setFavoriteChannels}
        />
      </div>
    </div>
  );
};

export default Home;