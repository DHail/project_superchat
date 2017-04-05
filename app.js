const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const expressHbs = require("express-handlebars");
const io = require("socket.io")(server);
const bodyParser = require("body-parser");

app.engine(
  "handlebars",
  expressHbs({
    defaultLayout: "main"
  })
);
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public`));

// routes
const index = require('./routes/index')(io);
app.use('/', index);

// error handling
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});






server.listen(3000);

module.exports = app;
