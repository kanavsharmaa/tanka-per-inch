import "dotenv/config";
import { connectToDB } from "./db/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

if (!PORT) throw new Error("PORT is not defined");

(async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
