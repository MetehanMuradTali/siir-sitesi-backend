import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    yorum:{
        type: String,
        required: true
    },
    postId:{
        type: Number,
        required: true
    },
    kullaniciIsim:{
        type: String,
        required: true
    }
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;