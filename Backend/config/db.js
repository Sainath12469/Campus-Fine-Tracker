const mongoose=require('mongoose');
const connectDB=async ()=>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mfinesdb");
        console.log("Connected to Databse");
    }catch(error)
    {
        console.log("Error Connecting to MongoDB");
        console.log(error);
        process.exit(0);
    }
};
module.exports=connectDB;