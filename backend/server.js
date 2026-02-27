import "dotenv/config";
import express from "express";
import cors from "cors";
import {connectDB} from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//App Config
const app = express();
const port = process.env.PORT || 4000;

//Middlewares
app.use(express.json());
app.use(cors());

// DB Connections
connectDB();

// Api Endpoints
app.use("/api/food", foodRouter);
// Serve uploaded images
app.use("/images", express.static("uploads"));
//User
app.use("/api/user", userRouter);
//Cart
app.use("/api/cart", cartRouter);
//Order
app.use("/api/order", orderRouter);

//Server Running
app.get("/", (req, res) => {
  res.send("<h1>Api Working</h1>");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
