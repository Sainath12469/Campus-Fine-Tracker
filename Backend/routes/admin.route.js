const express=require('express');
const router=express.Router();

const verifyToken=require('../middleware/auth.middleware.js')

const {
    studentDetails,
    createFine,
    getFines,
    getAnalysis,
    approveId,
    toApprove,
    deleteFine
}=require("../controller/admin.controller.js");

router.use(verifyToken);


router.post("/getAnalysis", getAnalysis);

router.get("/getStudentsDetails", studentDetails);
router.post("/createFine", createFine);

router.get("/getFines", getFines);

router.post("/deleteFine", deleteFine);
router.post("/approve", approveId);

router.get("/toapprove", toApprove);

module.exports = router;