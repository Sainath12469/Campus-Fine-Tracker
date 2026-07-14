const Fine=require("../model/fine.model");
const Student=require("../model/student.model");

const getFines=async (req,res)=>{
    try{
        const {studentId}=req.body;
        if(!studentId){
            return res.status(400).json({
                message:"Student ID is required"
            });
        }

        const data=await Fine.find({
            studentId:studentId
        });
        console.log(data);
        const studentData=await Student.findOne({
            id:studentId
        });

        if(!studentData){
            return res.status(404).json({
                message:"Student not found"
            });
        }

        if(data.length===0){
            return res.status(200).json({
                message:"No fines Records",
                studentData
            });
        }
        return res.status(200).json({
            data,studentData
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while fetching fine details"
        });
    }
}

const paidFines=async (req,res)=>{
    try{
        const {txnId,selectedFines}=req.body;
        if(!txnId || !selectedFines|| selectedFines.length===0)
        {
            return res.status(400).json({
                message:"Transaction ID and selected fines are required"
            });
        }
        const existingTxn =await Fine.find({
            txnId:txnId
        });

        if(existingTxn.length>0){
            return res.status(400).json({
                message:"Invalid UTR Number : Already exists"
            });
        }

        const result=await Fine.updateMany(
            {
                id:{$in:selectedFines}
            },
            {
                $set:{
                    status:"pending_approval",
                    txnId:txnId
                }
            }
        );

        if(result.modifiedCount===0){
            return res.status(400).json({
                message:"No fines updated"
            });
        }
        return res.status(200).json({
            message:`Status updated for ${result.modifiedCount} fines`
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error while updating fines"
        })

    }
}

module.exports={
    getFines,
    paidFines
}