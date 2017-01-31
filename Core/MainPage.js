var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var async = require('async');

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



function login(req,res) {
var body = '';
req.on('readable', function () {
    var c = req.read();
    if (c !== null) {
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
});}




function main(req,res) {
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

function checkMail(req,res) {
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
}

function registerUserToBase(req,res) {
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

}


function addTestim(req,res) {
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
}

function addSubscribedAmail(req,res) {
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
}
function refreshMassages(req,res) {
    try{//noinspection JSIgnoredPromiseFromCall
        Testimonial.find(
    ).populate("user").exec(function (er, resp) {
        res.send(resp);
    })}catch (e){
        res.render("error")
    }
}

function contactUs(req,res) {

    var body = '';
    req.on('readable', function () {
        var c = req.read();
        if (c !== null&&c!==undefined) {
            body += c
        }

    });

  req.on('end',function () {



      bodyj=JSON.parse(body);

     if(req.session.userId!==null&&req.session.userId!==undefined) {
         User.findById(req.session.userId,function (er,resp) {
             bodyj.name=resp.name;
             bodyj.email=resp.email;
             sendMailWithoutHtml(bodyj.email+"  "+bodyj.name,bodyj.text,"athene.lviv@gmail.com");
             res.send(resp)
         })

     }else{
         console.log("---else----------------");
         sendMailWithoutHtml(bodyj.email,bodyj.text,"athene.lviv@gmail.com");
         res.send(bodyj);
     }
  })
}
exports.refreshMassages=refreshMassages;
exports.addSubscribedMAil=addSubscribedAmail;
exports.registerUaser=registerUserToBase;
exports.addTestim=addTestim;
exports.login=login;
exports.checkMail=checkMail;
exports.contactUs=contactUs;
exports.mainPage=main;