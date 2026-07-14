const student=require('../model/student.model')
const fine=require('../model/fine.model');

const studentDetails=async (req,res)=>{
    try{
        const data=await student.find({});
        return res.status(200).json(data);
    }catch(err){
        return res.status(500).json({message: "Internal Server Error"});
    }
};

const createFine=async(req,res)=>{
    try{
        const record = req.body?.details;

        if(!record || !record.student_id || !record.fine_category || !record.amount || !record.due_date)
        {
            return res.status(400).json({message:"Fine details are required"});
        }
        let std= await student.findOne({
            id:record.student_id
        });

        if(!std)
        {
            std = await student.create({
                id: record.student_id,
                name: record.student_name || record.student_id,
                email: record.student_email || `${record.student_id}@campus.edu`,
                class: record.student_class || 'Unknown',
                section: record.student_section || 'A',
                fines: []
            });
        }

        const fineId=`F${Date.now()}`;

        await fine.create({
            id:fineId,
            studentId:record.student_id,
            category:record.fine_category,
            amount:Number(record.amount),
            reason:record.reason || '',
            due_date:new Date(record.due_date)
        })

        std.fines = Array.isArray(std.fines) ? std.fines : [];
        std.fines.push(fineId);
        await student.updateOne(
            {id :record.student_id},
            {fines:std.fines}
        );

        return res.status(201).json({
            message:"Fine Created successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error while creating fine"})
    }
};

const getFines=async (req,res)=>{
    try{
        const data=await fine.find({});
        return res.status(200).json(data);
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server Error"});
    }
};

const getAnalysis = async (req, res) => {
    try {
        const { load } = req.body;

        if (!load) {
            return res.status(400).json({
                message: "Invalid Request"
            });
        }

        const data = load;

        const allFines = await fine.find({});

        data.total_fines = allFines.length;

        allFines.forEach((fineItem) => {

            const batchNo = fineItem.studentId.substring(0, 2);

            const batch = data.batches.find(
                obj => String(obj.batch) === batchNo
            );

            if (batch) {
                batch.total_fines += 1;
                batch.total_amount += fineItem.amount;
            }

            if (fineItem.status === "pending") {
                data.total_pending += 1;
            } else if (fineItem.status === "paid") {
                data.total_collected += fineItem.amount;
            }

        });

        return res.status(200).json(data);

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error while fetching Analysis"
        });

    }
};

const approveId=async (req,res)=>{
    try{
        const {id,txnId}=req.body;
        const result=await fine.updateMany(
            {
                studentId:id,
                txnId:txnId
            },
            {
                status:"paid"
            }
        );
        if(result.modifiedCount===0)
        {
            return res.status(404).json({
                message:"No pending fines found"
            });
        }
        return res.status(200).json({
            message:"Fine Status Updated successfully"
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal Server Error"
        });
    
    }
};  
 
const toApprove=async (req,res)=>{
    try{
        const pendingFines=await fine.find({
            status:"pending_approval"
        });

        const students=await student.find({});
        const studentMap=students.reduce((map,stud)=>{
            map[stud.id]=stud;
            return map;
        },{});
        const groupedData={};
        pendingFines.forEach((Fine)=>{
            if(!groupedData[Fine.txnId])
            {
                groupedData[Fine.txnId]={
                    txnId:Fine.txnId,
                    studentId:Fine.studentId,
                    studentName:studentMap[Fine.studentId]?studentMap[Fine.studentId].name:"unknown",
                    totalAmount:0,
                    fines:[]
                };
            }
            groupedData[Fine.txnId].fines.push({
                category:Fine.category,
                reason:Fine.reason,
                amount:Fine.amount,
                due_date:Fine.due_date
            });
            groupedData[Fine.txnId].totalAmount+=Fine.amount;
        });

        return res.status(200).json(groupedData);


    }catch(err){
        console.log(err);
        return res.status(500).json(
            {message:"Internal Server Error"}
        )
    }
};

const deleteFine=async (req,res)=>{
    try{
        const {fid,stdId}=req.body;
        const std=await student.findOne({
            id:stdId
        });
        if(!std)
        {
            return res.status(404).json({
                message:"Student Not Found"
            });
        }

        const updatedFines=std.fines.filter(f=>f!==fid);

        const result=await fine.deleteOne({
            id:fid
        });
        await student.updateOne(
            {
                id:stdId,

            },
            {
                fines:updatedFines,
            }
        );

        if(result.deletedCount===1)
        {
            return res.status(200).json({
                message:"Fine deleted successfully"
            });
        }
        return res.status(404).json({
            message:"Fine not found"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
};

module.exports={
    studentDetails,
    createFine,
    getFines,
    getAnalysis,
    approveId,
    toApprove,
    deleteFine
};