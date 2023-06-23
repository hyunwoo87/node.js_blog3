const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const postsRouter = require("./routes/post.js");
const commentsRouter = require("./routes/comment.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");

const connect = require("./schemas");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));

app.use("/api", [postsRouter, commentsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("반갑습니다");
});

app.listen(port, () => {
  console.log(port, "BLOG가 열렸습니다");
});
