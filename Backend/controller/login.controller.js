const users=require('../model/users.model');
const jwt=require('jsonwebtoken');

const login=async (req,res)=>{
    try{
        if(!req.body.details){
            return res.status(400).json({
                message:"Login details required"
            });
        }
        const {uname,password}=req.body.details;
        const user=await users.findOne({
            id:uname
        });
        if(!user)
        {
            return res.status(400).json({
                message:"Invalid Username"
            });
        }
        if(user.password!==password)
        {
            return res.status(400).json({
                message:"Invalid Password"
            });
        }
        jwt.sign({user},"secret",(err,token)=>{
            if(err)
            {
                console.log(err);
                return res.status(500).json({
                    message:"Error generating token"
                });
            }
            console.log(user.id," logged in");
            return res.status(200).json({
                status:"Login Successfull",
                token:token
            });

        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        });

    }
};

module.exports={login};