// Node hub 2020

var express = require("express");
var favicon = require('serve-favicon');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname,'public','images','junket_logo_j_big_thin.ico')));

app.use("/", indexRouter);
app.use("/users", usersRouter);

var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
