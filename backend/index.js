 import express from "express";
 import dotenv from "dotenv";
 import connectDb from "./config/db.js";
 import testRoutes from "./routes/test.routes.js";
 dotenv.config();
 const app = express();
 const port = process.env.PORT || 8000;

 app.use("/api/test", testRoutes);

 app.listen(port, () => {
     connectDb();
   console.log(`Server is running on port ${port}`);
 });