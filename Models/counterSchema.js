import mongoose from "mongoose";

const counterSchema = mongoose.Schema({
    id:{
        type: String
    },
    seq:{
        type: Number,
    }
})

export default mongoose.model("counter",counterSchema)