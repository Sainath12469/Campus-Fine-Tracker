const mongoose = require('mongoose');

const model = new mongoose.Schema({
    type:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true
    }

});

module.exports=mongoose.model('finecategories',model);