var mongoose = require("../libs/mongoose");
var crypto=require("crypto");
var async=require("async");


var userSchema = mongoose.Schema(
    {
        registrationDate:{type:Date},
        name: {type: String,  required: true},
        surname: {type: String},
        email: {requierd: true, unique: true, type: String
        },
        hashedPassword: {type: String, required: true},
        phone: {type: String},
        salt:{required:true,type:String},
        testims:[{type:mongoose.Schema.Types.ObjectId,ref:"Testimonilal"}],
        massages:[{type:mongoose.Schema.Types.ObjectId,ref:"Massage"}],
        projects:[{type:mongoose.Schema.Types.ObjectId,ref:"Project"}]
    }
);

userSchema.methods.encryptPasword=function (password) {
 return crypto.createHmac("sha1",this.salt).update(password).digest("hex");
};



var testimonialShema=mongoose.Schema(
    {
        testimonial:{type :String,required:true},
        date:{type:Date},
        user:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
    }
);

userSchema.virtual('password')
    .set(function(password){
this._plainPasword=password;
this.salt=Math.random()+"";
this.hashedPassword=this.encryptPasword(password)
    }).get(function () {
   return this._plainPasword
});

userSchema.methods.checkPassword=function(password){
    return this.encryptPasword(password)==this.hashedPassword;
};





var massageSchema=mongoose.Schema({
    readed:{type:Boolean},
    massage: {type: String, required: true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    direction:{required:true,type:String},
    date:{type:String,required:true}
});


var subscribedEmail=mongoose.Schema({
    email: {type: String, required: true}
});

var projectSchema=mongoose.Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId,require:true,ref:"User"},
        projectName:{type:String,require:true},
        projectInfo:{type:String},
        date:{type:Date},
        statuse:{type:String}
    }
);



var staffScheme=mongoose.Schema(
    {
        JS:{type:String},
        JAVA:{type:String},
        DESIGN:{type:String},
        PHP:{type:String}

    }
);
exports.Staff=mongoose.model("Staff",staffScheme);
exports.SubscribedEmail=mongoose.model("SubscribedEmail",subscribedEmail);
exports.Project=mongoose.model("Project",projectSchema);
exports.Massage=mongoose.model("Massage",massageSchema);
exports.User=mongoose.model("User",userSchema);
exports.Testimonial=mongoose.model("Testimonilal",testimonialShema);