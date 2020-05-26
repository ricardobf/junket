// Junket

var express = require("express");
var favicon = require('serve-favicon');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require('express-session');

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var usersRouter = require("./routes/user");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(session({secret: "Shh, its a secret!"}));

// app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
// app.use(bodyParser.json());      
// app.use(bodyParser.urlencoded({extended: true}));

// var sess;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname,'public','images','junket_logo_j_big_thin.ico')));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", usersRouter);
app.use("/admin", adminRouter);

var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
