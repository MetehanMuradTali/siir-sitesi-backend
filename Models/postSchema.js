import mongoose from 'mongoose';
const postSchema = mongoose.Schema({
    baslik:{
        type: String,
        required: true
    },
    icerik:{
        type: String,
        required: true
    },
    id:{
        type: Number,
        required: true
    },
    tarih:{
        type:Date,
        default:Date.now
    },
    
})


const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;