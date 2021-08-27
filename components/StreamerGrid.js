import Image from "next/image";
import styles from "../styles/StreamerGrid.module.css";
import { useState, useEffect } from "react";
const StreamerGrid = ({ channels, setChannels }) => {
  // State
  const [localStorage, setLocalStorage] = useState(false);

  //effect
  useEffect(() => {
    if (localStorage) {
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

    const joinedChannels = filteredChannels
      .map((channel) => channel.display_name.toLowerCase())
      .join(",");
    setLocalStorage(joinedChannels);
  };


  //RenderMethod
  const renderGridItem = (channel) => (
    <div key={channel.id} className={styles.gridItem}>
      <button onClick={removeChannelAction(channel.id)}>X</button>
      <Image layout="fill" src={channel.thumbnail_url} alt="" />
      <div className={styles.gridItemContent}>
        <p>{channel.display_name}</p>
        {channel.is_live && <p>🔴 Live now!</p>}
        {!channel.is_live && <p>⚫ Offline</p>}
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
    <div>
      <h2>{`Bader's Twitch Dashboard 😎`}</h2>
      {channels.length > 0 && channels.map(renderGridItem)}
      {channels.length === 0 && renderNoItems()}
    </div>
  );
};

export default StreamerGrid;
