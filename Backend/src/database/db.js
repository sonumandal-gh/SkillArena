const mongoose = require("mongoose");

const mongoConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Connected");
        
    }
    catch(err){
        console.log("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports =mongoConnect;