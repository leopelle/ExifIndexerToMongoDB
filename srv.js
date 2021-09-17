var express = require("express");
var app = express();
var router = express.Router();

var path = __dirname + '/views/';

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index2.html");
});

router.get("/about", function (req, res) {
    res.sendFile(path + "about.html");
});

router.get("/message", function (req, res) {
    res.send({title: 'Hello from Nodeeee'});
});

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})