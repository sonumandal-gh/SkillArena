const mongoose = require("mongoose");

const mongoConnect = async () => {
    try {
        const connectionString = process.env.MONGO_URL || process.env.MONGO_URI;
        if (!connectionString) {
            throw new Error("MongoDB connection string missing (MONGO_URL or MONGO_URI)");
        }
        await mongoose.connect(connectionString);

        console.log("mongoDb Connected");
    } catch (err) {
        console.log("mongodb Connection error", err);
        process.exit(1);
    }
}

module.exports = mongoConnect;