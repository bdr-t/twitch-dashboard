import Image from "next/image";
import styles from "../styles/StreamerGrid.module.css";
import { useState, useEffect } from "react";
const StreamerGrid = ({ channels, setChannels }) => {
  // State
  const [localStorage, setLocalStorage] = useState(false);

  //effect
  useEffect(() => {
    if (localStorage || localStorage === "") {
      window.localStorage.setItem("CHANNELS", localStorage);
      setLocalStorage(false);
    }
  }, [localStorage]);

  //Actions
  const removeChannelAction = (channelId) => async () => {
    const filteredChannels = channels.filter(
      (channel) => channel.id !== channelId
    );

    setChannels(filteredChannels);

    let joinedChannels;

    if (filteredChannels === 1) {
      joinedChannels = filteredChannels;
    } else {
      joinedChannels = filteredChannels
        .map((channel) => channel.display_name.toLowerCase())
        .join(",");
    }
    setLocalStorage(joinedChannels);
  };

  //RenderMethod
  const renderGridItem = (channel) => (
    <div key={channel.id} className={styles.gridItem}>
      <button onClick={removeChannelAction(channel.id)}>X</button>
      <Image layout="fill" src={channel.thumbnail_url} alt="" />
      <div className={styles.gridItemContent}>
        {channel.is_live && <p>🔴 Live!</p>}
      </div>
      <div className={styles.gridItemName}>
        <p>{channel.display_name}</p>
      </div>
    </div>
  );

  const renderNoItems = () => {
    return (
      <div className={styles.gridNoItems}>
        <p> Add a streamer to get Started</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.streamerGridTitle}>{`My Twitch Dashboard 😎`}</h2>
      <div className={styles.streamerGridContainer}>
        {channels.length > 0 && channels.map(renderGridItem)}
        {channels.length === 0 && renderNoItems()}
      </div>
    </div>
  );
};

export default StreamerGrid;
