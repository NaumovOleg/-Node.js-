var config=require("config");
var mongoose = require('mongoose');
mongoose.connect(config.get('mongoose:uri'));
module.exports=mongoose;
