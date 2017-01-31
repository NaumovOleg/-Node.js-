var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var async = require('async');
var bodyParser = require('body-parser');
var mongoose = require("./libs/mongoose");

var domain = require("domain");
var safe = domain.create();
var http = require("http");
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var url = require("url");
var app = express();
var connect = require('connect');
var config = require("config");
var app2 = connect();
var port = config.get('port');
console.log(__dirname);
app.set("port", port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    name: 'session',
    keys: config.get("session:key"),
    maxAge: null,
    secret: config.get("session:secret"),
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
http.createServer(app).listen(app.get("port"));

var login = require("Core/MainPage").login;
var main = require("Core/MainPage").mainPage;
var checkMail = require("Core/MainPage").checkMail;
var editUser = require("Core/cabinetPage").editUser;
var registerUserToBase = require("Core/MainPage").registerUaser;
var addTestim = require("Core/MainPage").addTestim;
var refreshMassages = require("Core/MainPage").refreshMassages;
var addSubscribedMAil = require("Core/MainPage").addSubscribedMAil;
var cabinet = require("Core/cabinetPage").cabinet;
var sendMassageFromUserToUs = require("Core/cabinetPage").sendMassageFromUserToUs;
var sendMultiMassage = require("Core/AdminPanel").sendMultiMassage;
var admin = require("Core/AdminPanel").admin;
var setUserForAdmin = require("Core/AdminPanel").setUserForAdmin;
var changeStatus = require("Core/AdminPanel").changeStatus;
var addProjectToUser = require("Core/AdminPanel").addProjectToUser;
var setStaff = require("Core/AdminPanel").setStaff;
var sendMassageFromAdminToUser = require("Core/AdminPanel").sendMassageFromAdminToUser;
var contactUs=require('Core/MainPage').contactUs;
app.post("/login", function (req, res) {
    login(req, res)
});
app.post("/editUser", function (req, res) {
    editUser(req, res)
});
app.use(function (req, res, next) {
    if (req.url === "/") {
        main(req, res)
    }
    else {
        console.log(req.url);
        next();
    }
});
app.post("/ckeckMail", function (req, res) {
    checkMail(req, res)
});
app.post("/registerUsertobase", function (req, res) {
    registerUserToBase(req, res)
});
app.get("/logout",
    function (req, res) {
        req.session.userId = null;
        res.locals.user = null;
        res.locals.errors = null;
        res.end();
});
app.post("/addTestim", function (req, res) {
    addTestim(req, res);
});
app.post("/addsubscribedMassage", function (req, res) {
    addSubscribedMAil(req, res);
});
app.get("/refreshMassages", function (req, res) {
    refreshMassages(req, res)
});
app.use("/cabinet", function (req, res) {
    cabinet(req, res)
});
app.post("/userSendMassage", function (req, res) {
    sendMassageFromUserToUs(req, res);
});
app.post("/setUserForAdmin", function (req, res) {
    setUserForAdmin(req, res)
});
app.use("/admin", function (req, res) {
    admin(req, res)
});
app.post("/sendMassageToUserFromAdmin", function (req, res) {
    sendMassageFromAdminToUser(req, res)
});
app.post("/setStaff", function (req, res) {
    setStaff(req, res)
});
app.post("/addProjectToUser", function (req, res) {
    addProjectToUser(req, res)
});
app.post("/changeStatus", function (req, res) {
    changeStatus(req, res)
});
app.post("/sendMultiMassages", function (req, res) {
    sendMultiMassage(req, res);
});


app.post('/contactUS',function (req,res) {

    contactUs(req,res);

});
app.get("/try", function (rq, res) {
//    Massage.find().populate({path:'user',match:{name:'qqqq'},select:'name'}).exec(function (er,resp) {
//        console.log(resp+" -----\n");
// res.send(resp);
//
//    })
// User.findOne({name:"qqqq"}).select('massages').populate('massages').exec(function (er,resp) {
//     console.log(resp)
// })

    //noinspection JSIgnoredPromiseFromCall
    Massage.find({user: {name: "qqqq"}}).populate('user').exec(function (er, resp) {
        console.log(resp)
    })

});
app.use(function (req, res, next) {
    console.log(req.url + " [error");
    if (req.url === "/errore") {
        res.render("error");
    } else {
        next();
    }
});
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
