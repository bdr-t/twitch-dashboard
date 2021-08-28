// Main entry point of your app
import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import StreamerGrid from "../components/StreamerGrid";

const Home = () => {
  //State
  const [favoriteChannels, setFavoriteChannels] = useState([]);

  //Effects

  useEffect(() => {
    if (window.localStorage.getItem("CHANNELS") === null) {
      window.localStorage.setItem("CHANNELS", "");
    }
    fetchChannels();
  }, []);


  useEffect(()=>{
    let values = ''
    for(let channel of favoriteChannels){
      values+= channel.display_name + ','
    }
    values = values.slice(0, length-1);
    window.localStorage.setItem('CHANNELS', values)
  },[favoriteChannels])


  // Actions

  const fetchChannels = async () => {
    let channels = window.localStorage.getItem("CHANNELS");

    try {
      //Get keys from localstorage
      if (channels) {
        const channelNames = channels.replace(/\[|\]/g, "").split(",");
        //Get twitch data and set in channels State
        const channelData = [];

        for await (let channelName of channelNames) {
          const channelResp = await fetch(`/api/twitch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: channelName }),
          });

          const json = await channelResp.json();

          if (json.channelData) {
            channelData.push(json.channelData);
          }
        }
        setFavoriteChannels(channelData);
      }
    } catch (error) {
      console.warn(error.message);
    }
  };

  const setChannel = async (channelName) => {
    //Get all the current streamers names in the list
    const currentStreamers = favoriteChannels.map((channel) =>
      channel.display_name.toLowerCase()
    );

    let streamerList;
    if (currentStreamers.length === 1) {
      streamerList = currentStreamers;
    } else {
      streamerList = [...currentStreamers, channelName].join(",");
    }

  };

  const addStreamChannel = async (event) => {
    // Prevent the page from redirecting
    event.preventDefault();

    const { value } = event.target.elements.name;

    if (value) {
      // Call Twitch Search API
      const response = await fetch(`/api/twitch`, {
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
        <form onSubmit={addStreamChannel} autoComplete="off">
          <input
            id="name"
            placeholder="Twitch Channel Name"
            type="text"
            required
          />
          <h2 className={styles.title}>
            Type your favorite Twitch Channel above to add it to your list!
          </h2>
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
