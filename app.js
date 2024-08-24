const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.use("/",require("./routes"));

//error handling
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({
    error: "ServerError",
    message: err.message,
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})