// These are database actions needed to interact with Replit DB!
// Feel free to see how this works or how to make it better!

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    if (req.method === "POST") {
      if (req.body) {
        const { key, value, action } = JSON.parse(req.body);

        if (action === "GET_CHANNELS") {
          const value = await getValue(key);
          if (value) {
            res.status(200).json({ data: value });
          } else {
            res.status(404).send();
          }
        } else {
          console.log("SE EJECUTA ESTE CODIGO");
          const success = await setKey(key, value);
          if (success) {
            res.status(200).send();
          }
        }
      }
    }
  } catch (error) {
    console.warn(error.message);
    res.status(500).send();
  }
};

// Actions
const setKey = async (key, value) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem('hola', value);
    }
  } catch (err) {
    console.log(err);
  }
};

const getValue = async (key) => {

  try {
    let values = await window.localStorage.getItem(key);
    console.log(values);
    return window.localStorage.getItem(key);
  } catch (err) {
    console.warn(err.message);
    return false;
  }
};
