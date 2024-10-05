import ConnectDB from "./db/connectDb.js";
import app from "./app.js";
import env from "./constants.js";

const PORT = env.port || 5000;

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
