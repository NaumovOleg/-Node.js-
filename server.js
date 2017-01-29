
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var async = require('async');
var bodyParser = require('body-parser');
var mongoose = require("./libs/mongoose");
var sendMailWithoutHtml = require('./MAilSender/Mailer').sendMAilWithoutHtml;
var sendHtmlmail = require('./MAilSender/Mailer').sendHtmlMail;

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
var User = require("./models/Models").User;
var Staff = require("./models/Models").Staff;
var Testimonial = require("./models/Models").Testimonial;
var SubscribedEmail = require("./models/Models").SubscribedEmail;
var Massage = require("./models/Models").Massage;
var Project = require("./models/Models").Project;

app.post("/login", function (req, res) {
    var body = '';
    req.on('readable', function () {
        var c = req.read();
        if (c != null) {
            body += c
        }

    });
    req.on("end", function () {
        var emPas = JSON.parse(body);
        console.log(emPas.email);
        User.findOne({email: emPas.email}, function (er, resp) {
            if (er) {
                res.end("Sorry, we have some errors");
            }
            if (resp) {
                if (resp.checkPassword(emPas.password)) {
                    req.session.userId = resp._id;
                    res.locals.user = resp;
                    res.locals.credentialerrors = null;
                    res.send("good");
                } else {

                    res.send("Invalid Credentials");
                }
            }
            else {
                console.log(emPas.email);
                req.session.userId = null;
                res.send("Invalid Credentials");
            }
        });
    });
});
app.post("/editUser", function (req, res) {
    var bodyUSer = '';
    req.on('readable', function () {
        var c = req.read();
        if (c !== null) {
            bodyUSer += c;
        }
    });
    req.on('end', function () {

        var us = JSON.parse(bodyUSer);
        async.waterfall(
            [
                function (callback) {
                    User.findById(req.session.userId, function (er, resp) {
                        callback(null, resp)
                    })
                },
                function (arg1, callback) {
                    if (us.name !== null && us.name !== undefined && us.name !== "") {
                        arg1.name = us.name;
                    }
                    if (us.phone !== null && us.phone !== undefined && us.phone !== "") {
                        arg1.phone = us.phone;
                    }

                    if (us.email !== null && us.email !== undefined && us.email !== "") {
                        arg1.email = us.email;
                    }


                    callback(null, arg1)
                },
                function (arg2, callback) {
                    try {
                        arg2.save(function (er, response) {
                            sendMailWithoutHtml("Athene", "You have changed your credentials:\n name " + arg2.name + "\n"
                                + "email " + arg2.email + "\n" + "phone: " + arg2.phone + "\n" + "Yours sincerely.Athene", arg2.email
                            )

                        });
                    } catch (e) {
                        res.render("Error");
                    }

                    callback(null, arg2)
                }
            ], function (err, result) {
                res.end("refreshed");
            }
        )
    })


});

app.use(function (req, res, next) {
    if (req.url === "/") {
        if (req.session.userId !== null && req.session.userId !== undefined) {
            User.findOne({_id: req.session.userId},
                function (er, usere) {
                    if (usere) {
                        try {
                            Staff.findOne({}, function (er, respes) {
                                Massage.find({user: req.session.userId, readed: false}, function (er, r) {
                                    res.locals.staff = respes;
                                    res.locals.counMassages = r.length.toString();
                                    res.locals.user = usere;
                                    res.render("Main");

                                })

                            })
                        } catch (e) {
                        }
                        res.locals.user = usere;
                    }
                })
        } else {

            try {
                Staff.findOne({}, function (er, respes) {
                    res.locals.staff = respes;
                    res.render("Main", {user: null})
                })
            } catch (e) {
                next()
            }
        }
    }
    else {
        console.log(req.url);
        next();
    }
});


app.post("/ckeckMail", function (req, res) {
    var bodyEmail = '';
    req.on('readable', function () {
        var c = req.read();
        if (c !== null) {
            bodyEmail += c;
        }
    });
    req.on('end', function () {
        User.findOne({email: bodyEmail}, function (er, resp) {
            console.log(resp);
            if (resp === null || resp === undefined) {
                res.send("empty");
            }
            else {
                res.send("notEmpty");
            }
        })
    })
});


app.post("/registerUsertobase", function (req, res) {
    var usere = '';
    req.on('readable', function () {
        var c = req.read();
        if (c !== null) {
            usere += c
        }
    });

    req.on('end', function () {
        var us = JSON.parse(usere);
        var userToSave = new User(us);
        userToSave.save(function (er, noer) {
            if (noer) {
                sendMailWithoutHtml("Registration in Athene", "Hello dear " + userToSave.name + "\n" +
                    "We are glad to inform you about your registration at Athene \n  Your password : " + us.password + "\n" +
                    "Yours sincerely.Athene", userToSave.email
                );
                res.send("addUser");
            }
            if (er) {
                res.send("error");
            }
        });

    });

});

app.get("/logout",
    function (req, res) {
        req.session.userId = null;
        res.locals.user = null;
        res.locals.errors = null;
        res.end();
    });


app.post("/addTestim", function (req, res) {
    var sendedtestimonial = '';
    req.on("readable", function () {
        var c = req.read();
        if (c !== null) {
            sendedtestimonial += c;
        }
    });

    req.on("end", function () {
        User.findById(req.session.userId, function (error, usere) {

            var testim = new Testimonial({user: usere, date: new Date(), testimonial: sendedtestimonial});
            usere.testims.push(testim);
            if (sendedtestimonial !== null && sendedtestimonial !== undefined) {
                testim.save(function (e, r) {
                    usere.save(function (e, r) {
                        res.send(r);
                    })
                })
            } else {
                res.send("please enter email");
            }

        })
    })
});


app.get("/refreshMassages", function (req, res) {
    Testimonial.find(
    ).populate("user").exec(function (er, resp) {
        res.send(resp);
    })
});


app.use("/cabinet", function (req, res) {
    if (req.session.userId !== null && req.session.userId !== undefined) {
        var user;
        var massages;
        var projects;
        async.waterfall([
            function (callback) {

                User.findById(req.session.userId, function (er, resp) {
                    if (er) {
                        res.render("error")
                    }
                    else {
                        user = resp;
                        callback(null, resp);
                    }
                })
            },
            function (arg1, callback) {
                Massage.update({user: req.session.userId}, {$set: {readed: true}}, {multi: true}, function (er, respona) {
                });
                callback(null, arg1);

            },
            function (arg1, callback) {

                console.log(arg1);
                Massage.find().populate({
                    path: "user",
                    select: "name",
                    match: {_id: arg1._id}
                }).exec(function (er, respa) {
                    // massages = respa;
                    var realmass = [];
                    for (var i = 0; i < respa.length; i++) {
                        if (respa[i].user !== null && respa[i].user !== undefined) {
                            realmass.push(respa[i]);
                        }
                    }
                    massages = realmass;
                    callback(null, arg1);
                })

            },
            function (arg1, callback) {
                Project.find({user: req.session.userId}, function (er, respa) {
                    if (respa) {
                        res.locals.project = respa;
                    }
                    callback(null, "good");
                });

            }
        ], function (err, result) {

            res.locals.user = user;
            res.locals.massaged = massages;
            res.render("cabinet")
        });
    } else {
        res.render("youHavNoAccsees");
    }
});


app.post("/userSendMassage", function (req, res) {
    if (req.session.userId !== null && req.session.userId !== undefined) {
        var massageBody = '';
        req.on("readable", function () {
            var c = req.read();
            if (c !== null) {
                massageBody += c;
            }
        });
        req.on("end", function () {
            if (massageBody !== null && massageBody !== undefined) {
                User.findById(req.session.userId, function (er, resp) {
                    if (er) {
                        res.send("some errors");
                    }
                    else {
                        var mass = {
                            user: resp._id,
                            massage: massageBody,
                            date: new Date(),
                            direction: "toUs",
                            readed: true
                        };
                        var massage = new Massage(mass);
                        massage.save(function (er, respa) {
                            res.send("massage is saved  \n");
                        })

                    }
                })


            } else {
                res.send("enter Massage");
            }
        });
    } else {
        res.render("youHavNoAccsees");
    }


});

app.post("/setUserForAdmin", function (req, res) {
    var mail = '';
    async.waterfall([
        function (callback) {
            req.on('readable', function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    mail += c;
                }
            });
            req.on('end', function () {

                callback(null, mail)
            });

        }, function (args1, callback) {
            User.findOne({email: args1}, function (er, resp) {
                callback(null, resp);

            })
        },
        function (arg2, callback) {

            req.session.UserForAdmin = arg2._id;
            res.send("good")

        }


    ], function (errorr, response) {

    });
});

app.use("/admin", function (req, res) {

    async.waterfall([
        function (callback) {
            if (req.session.UserForAdmin === null || req.session.UserForAdmin === undefined) {
                User.find({}, function (eer, respuser) {
                    if(respuser[0]!==undefined&&respuser[0]!==null){
                    res.locals.UserForAdmin = respuser[0];
                    req.session.UserForAdmin = respuser[0]._id;
                    callback(null, respuser[0]._id);}
                    else (callback("null",null))
                })

            }
            else {
                User.findById(req.session.UserForAdmin, function (er, respon) {
                    if(respon===undefined||respon===null||respon===''){
                        callback("User not founded",null);
                    }
                    res.locals.UserForAdmin = respon;
                    callback(null, req.session.UserForAdmin)
                });
            }
        },
        function (userArg, callback) {
            Massage.find({user: userArg}, function (er, massResp) {
                res.locals.MassagesForAdmin = massResp;
                callback(null, userArg)
            })
        },
        function (projArg, callback) {
            Project.find({user: projArg}, function (er, projResp) {
                res.locals.projectsForAdmin = projResp;
                callback(null, projArg)
            })
        },
        function (useArgs, callback) {
            User.find(function (er, userAllresp) {
                res.locals.AllUsersforAdmin = userAllresp;
                callback(null, "good")
            })
        }


    ], function (err, result) {
        if(err){
            res.locals.AllUsersforAdmin = null;
            res.locals.projectsForAdmin = null;
            res.locals.MassagesForAdmin = null;
            res.locals.UserForAdmin = null;
            req.session.UserForAdmin = null;
            res.render("Admin")
        }
        res.render("Admin")
    })

});


app.post("/sendMassageToUserFromAdmin", function (req, res) {
    var mail = '';
    req.on('readable', function () {
        var c = req.read();
        if (c !== null && c !== undefined) {
            mail += c;
        }
    });
    req.on('end', function () {
        async.waterfall([
                function (callback) {
                    callback(null, mail)
                },

                function (em, callback) {
                    User.findById(req.session.UserForAdmin, function (er, resp) {
                        callback(null, resp)
                    })
                },
                function (arg1, callback) {
                    console.log(arg1);
                    var mass = {
                        user: arg1._id,
                        massage: mail,
                        date: new Date(),
                        direction: "fromUs",
                        readed: false
                    };
                    var massage = new Massage(mass);
                    arg1.massages.push(massage);
                    massage.save(function (er, respa) {
                        arg1.save(function (er, resp) {
                        })
                    });
                    callback(null, arg1.name + "---" + mass.massage);
                }
            ], function (err, result) {
                res.send(result)
            }
        )
    });
});


app.post("/setStaff", function (req, res) {
    async.waterfall([
        function (callback) {
            var staff = '';
            req.on("readable", function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    staff += c;
                }
            });
            req.on("end", function () {
                var staffparsed = JSON.parse(staff);
                callback(null, staffparsed)
            })
        },
        function (args1, callback) {
            Staff.findOne(function (er, respas) {
                if (er) {
                    res.render("error")
                }
                if (respas === null || respas === undefined || respas === '') {
                    var staffToSave = new Staff(args1);
                    staffToSave.save(function () {
                        res.send("new staff saveed--------------------");
                        callback(null, staffToSave);
                    })
                } else {
                    respas.JS = args1.JS;
                    respas.JAVA = args1.JAVA;
                    respas.PHP = args1.PHP;
                    respas.DESIGN = args1.DESIGN;
                    respas.save(function () {
                        res.send("staff saved");
                        callback(null, respas);
                    })
                }
            })
        }
    ], function (er, result) {
        console.log(result)
    })
});

app.post("/addProjectToUser", function (req, res) {
    async.waterfall([
        function (callback) {
            var body = '';
            req.on("readable", function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    body += c;
                }
            });
            req.on("end", function () {
                var projectSchema = JSON.parse(body);
                callback(null, projectSchema);
            })
        },

        function (args1, callback) {
            args1['date'] = new Date();
            args1['statuse'] = "IN PROCESS";
            callback(null, args1);
        },
        function (arg2, callback) {
            User.findById(arg2.user, function (er, resp) {

                var project = new Project(arg2);
                resp.projects.push(project);
                resp.save(function (err, respUser) {
                    project.save(function (er, resPr) {
                        sendMailWithoutHtml("Athene news ", "Hello dear " + resp.name + "\n" +
                            "We have got your project ( " + project.projectName + ").Our developers are working on it\n" +
                            "In case it is finished,you get massage.  You can see its status at your users-room at our site.\n" +
                            "Yours sincerely.Athene", resp.email
                        );
                        callback(null, arg2)
                    });

                })
            })
        }

    ], function (er, result) {
        res.send("added");
    })
});


app.post("/changeStatus", function (req, res) {
    async.waterfall([
        function (callback) {
            var body = req.read();
            req.on("readable", function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    body += c;
                }
            });
            req.on('end', function () {
                callback(null, body)
            })
        },
        function (args1, callback) {

            Project.update({_id: args1}, {$set: {statuse: "IS Accomplish"}}, {multi: true},
                function (er, resp) {
                    callback(null, args1)
                }
            )
        },
        function (args2, callback) {
            //noinspection JSIgnoredPromiseFromCall
            Project.findOne({_id: args2}).populate("user").exec(function (er, resp) {
                sendMailWithoutHtml("Athene news", "Hello dear " + resp.user.name + "\n" +
                    "We are glad to inform You that Your Project(" + resp.name + "is accomplished\n" +
                    "Please , contact us at phone or email\nYours sincerely.Athene", resp.user.email);
                callback(null, "good");
            })
        }

    ], function (error, result) {
        res.send(result)
    })
});


app.post("/addsubscribedMassage", function (req, res) {
    async.waterfall([
        function (callback) {
            var body = '';
            req.on("readable", function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    body += c;
                }
            });
            req.on("end", function () {
                callback(null, body)
            })
        },
        function (args, callback) {
            User.findOne({email: args}, function (er, resp) {
                if (resp === null || resp === undefined || resp === "") {
                    callback(null, args)
                } else {
                    callback("User have this email", null);
                }
            })
        },
        function (arg2, callback) {
            SubscribedEmail.findOne({email: arg2}, function (er, respa) {
                if (respa) {
                    callback("this email is already  subscribed", null)
                }
                else {
                    callback(null, arg2)
                }
            })
        },
        function (args3, callback) {
            var subscribedMail = new SubscribedEmail({email: args3});
            subscribedMail.save(function (er, resp) {
                if (er) {
                    callback("Some errors", null)
                }
                else {
                    callback(null, "You have subscribed")
                }
            })
        }

    ], function (error, resp) {
        if (error) {
            res.send(error)
        }
        else {
            res.send(resp);
        }

    })
});

app.post("/sendMultiMassages", function (req, res) {
    async.waterfall([
        function (callback) {
            var body = '';
            req.on("readable", function () {
                var c = req.read();
                if (c !== null && c !== undefined) {
                    body += c;
                }
            });
            req.on("end", function () {
                callback(null, body)
            })
        },
        function (args, callback) {
            User.find().select('email').exec(function (er, resp) {
                callback(null, resp, args);
            })

        },
        function (arg2, args, callback) {
            var mails = new Set();

            for (var i = 0; i < arg2.length; i++) {
                mails.add(arg2[i].email)
            }

            SubscribedEmail.find().select('email').exec(function (er, resp) {
                for (var i = 0; i < resp.length; i++) {
                    mails.add(resp[i].email)
                }
                callback(null, mails, args);
            })
        },
        function (arg2, args, callback) {
            var mailsToSend = [];
            arg2.forEach(function (item, e, i) {
                mailsToSend.push(item);
            });
            sendHtmlmail("Athene news", args, mailsToSend);
            callback(null, arg2, args);
        }


    ], function (error, resp) {
        if (error) {
            res.send("error")
        }
        else {
            res.send("result");
        }
    })
});




app.get("/try",function (rq,res) {
//    Massage.find().populate({path:'user',match:{name:'qqqq'},select:'name'}).exec(function (er,resp) {
//        console.log(resp+" -----\n");
// res.send(resp);
//
//    })
// User.findOne({name:"qqqq"}).select('massages').populate('massages').exec(function (er,resp) {
//     console.log(resp)
// })

    //noinspection JSIgnoredPromiseFromCall
    Massage.find({user:{name:"qqqq"}}).populate('user').exec(function (er,resp) {
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
