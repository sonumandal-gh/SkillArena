const mongoose = require("mongoose");

const mongoConnect = async (req, res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);

        console.log("mongoDb Connected");
    }catch(err){
        console.log("mongodb Connection error", err);
        process.exit(1);
    }
}

module.exports = mongoConnect;