require('dotenv').config()
const express = require("express")
const PORT = process.env.PORT
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const eventRoute =require("./routes/event.routes")
const aiRoute = require("./routes/ai.routes")


// DNS Issue resolve
const dns = require('dns');
const { default: mongoose } = require('mongoose');
dns.setServers(['8.8.8.8', '8.8.4.4']);


const DB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DATABASE CONNECTED");
    }
    catch(error){
        console.log(error);
    }
}
DB()

// middleware 
app.use(cors({origin:"https://senti-nal-ai.netlify.app",credentials:true}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use("/event",eventRoute)
app.use("/ai",aiRoute)





// server
app.listen(PORT,()=>{
    console.log("SERVER STARTED");
})