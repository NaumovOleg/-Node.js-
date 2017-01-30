var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var async = require('async');
var bodyParser = require('body-parser');

var sendMailWithoutHtml = require('MAilSender/Mailer').sendMAilWithoutHtml;

var domain=require("domain");
var safe=domain.create();

var url = require("url");

var User = require("models/Models").User;
var Staff = require("models/Models").Staff;
var Testimonial = require("models/Models").Testimonial;
var SubscribedEmail = require("models/Models").SubscribedEmail;
var Massage = require("models/Models").Massage;
var Project = require("models/Models").Project;

function editUser(req,res) {
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

}
function cabinet(req,res) {
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
}


function sendMassageFromUserToUs(req,res) {
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

}

exports.sendMassageFromUserToUs=sendMassageFromUserToUs;
exports.editUser=editUser;
exports.cabinet=cabinet;