import mongoose from "mongoose";
// console.log("check",process.env.MONGOURI);

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ DB connected successfully!");
  } catch (error) {
    console.error("❌ Error while connecting to DB:", error.message);
  }
};
