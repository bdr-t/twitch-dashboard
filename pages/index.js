import styles from '../styles/Home.module.css'

const Home = () => {

  //Render methods
  const renderForm = () => {
    return (
      <div className={styles.formContainer}>
        <form>
          <input id='name' placeholder='Twitch Channel Name' type='text' required />
          <button type='sumbit'>Add Streamer</button>
        </form>

      </div>)
  }
  return (
    <div className={styles.container}>
      <head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </head>
      <div className={styles.inputContainer}>
        {renderForm()}
      </div>
    </div>
  )
}
export default Home