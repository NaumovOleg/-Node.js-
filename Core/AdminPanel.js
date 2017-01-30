var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var async = require('async');
var bodyParser = require('body-parser');

var sendMailWithoutHtml = require('MAilSender/Mailer').sendMAilWithoutHtml;
var sendHtmlmail = require('MAilSender/Mailer').sendHtmlMail;
var domain=require("domain");
var safe=domain.create();

var url = require("url");

var User = require("models/Models").User;
var Staff = require("models/Models").Staff;
var Testimonial = require("models/Models").Testimonial;
var SubscribedEmail = require("models/Models").SubscribedEmail;
var Massage = require("models/Models").Massage;
var Project = require("models/Models").Project;


function sendMultiMassage(req,res) {
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
}
function  setUserForAdmin(req,res) {
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
}


function admin(req,res) {

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

}

function changeStatus(req,res) {
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
            console.log(args2+"===============================")
            //noinspection JSIgnoredPromiseFromCall
            Project.findOne({_id: args2}).populate("user").exec(function (er, resp) {
                console.log(resp+"eeeeee==============================")
                sendMailWithoutHtml("Athene news", "Hello dear " + resp.user.name + "\n" +
                    "We are glad to inform You that Your Project(" + resp.projectName + "is accomplished )\n" +
                    "Please , contact us at phone or email\nYours sincerely.Athene", resp.user.email);
                callback(null, "good");
            })
        }

    ], function (error, result) {
        res.send(result)
    })
}

function addProjectToUser(req,res) {
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
}
function setStaff(req,res) {
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
}
function sendMassageFromAdminToUser(req,res) {
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
}
exports.sendMassageFromAdminToUser=sendMassageFromAdminToUser
exports.setStaff=setStaff;
exports.addProjectToUser=addProjectToUser;
exports.changeStatus=changeStatus;
exports.admin=admin;
exports.setUserForAdmin=setUserForAdmin;
exports.sendMultiMassage=sendMultiMassage;

