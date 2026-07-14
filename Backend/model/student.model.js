const mongoose=require("mongoose");

const std=new mongoose.Schema({
    id:{
        type:String,
        requied:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requied:true
    },
    class:{
        type:String,
        requied:true
    },
    section:{
        type:String,
        required:true,
        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    },
    fines:[{
        type:String
    }]

});

module.exports=mongoose.model('Student',std);