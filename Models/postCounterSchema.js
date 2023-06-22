import mongoose from "mongoose";

const postcounterSchema = mongoose.Schema({
    id:{
        type: String
    },
    seq:{
        type: Number,
    }
})
const PostCounter = mongoose.models.PostCounter || mongoose.model('PostCounter', postcounterSchema);

export default PostCounter;