import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://krishgupta8054:s5j1vAGGg9WEIQt1@cluster0.uf76bn5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1);
    }
};

