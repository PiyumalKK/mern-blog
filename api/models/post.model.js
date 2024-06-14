import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default:"https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    category:{
        type: String,
        default: 'uncategorized'
    },
    slug:{
        type: String,
        required: true,
        unique: true,
    },
},{timestamps:true}
);

const Post = mongoose.model('Post',postSchema);

export default Post;