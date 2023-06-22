import mongoose from "mongoose";

const commentcounterSchema = mongoose.Schema({
    id:{
        type: String
    },
    seq:{
        type: Number,
    }
})
const CommentCounter = mongoose.models.CommentCounter || mongoose.model('CommentCounter', commentcounterSchema);

export default CommentCounter;