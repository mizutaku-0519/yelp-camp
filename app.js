const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("HOME");
});

app.listen(3000, () => {
  console.log("ポート番号3000で受付中...");
});
