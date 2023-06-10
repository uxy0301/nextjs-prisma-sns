const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const cors = require("cors");

require("dotenv").config();

const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));