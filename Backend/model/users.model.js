const mongoose =require('mongoose');
const user=new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        default:null,
        unique:true
    }
});
module.exports=mongoose.model('Users',user);    