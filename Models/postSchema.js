import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    baslik:{
        type: String,
        required: true
    },
    icerik:{
        type: String,
        required: true
    },
    like:{
        type:[]
    },
    tarih:{
        type:Date,
        default:Date.now
    },
    yorumlar:{
        type:[]
    }
})


export default mongoose.model("PostModel",postSchema)