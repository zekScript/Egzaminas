import mongoose from "mongoose";

const userScema = new mongoose.Schema({
            name:{
                        type: String,
                        required: true,
            },
            email:{
                        type: String,
                        required: true,
            },
            password:{
                  type: String,
                  required: true,
            },
            role:{
                  type: String,
                  required: true,
                  default: "USER"
            },
            ticketCount:{
                  type: Number,
                  default: 0
            },
            date: { 
                  type: Date,
                  default: Date.now
            },
})

// Post schema

const postSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      createdAt: { type: Date, default: Date.now },
      imageUrl: [{ type: String }], 
      country: { type: String },
      city: { type: String },
      views: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      startDate: { type: Date },
});

export const User =  mongoose.model("Users", userScema)
export const Post = mongoose.model("Post", postSchema);