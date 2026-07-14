const express=require('express');
const cors=require('cors');

const connectDB=require("./config/db");

const loginRoute=require("./routes/login.route");   
const adminRoute=require("./routes/admin.route");
const studentRoute=require("./routes/student.route");
const getRoute=require("./routes/get.route");

const app=express();
const PORT=4000;

/*Connection to DB */
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//routes
app.use('/login',loginRoute);
app.use('/admin',adminRoute);
app.use('/student',studentRoute);
app.use('/',getRoute);

//Start server
app.listen(PORT,()=>{
    console.log(`Server is Running on Port:${PORT}`);
});