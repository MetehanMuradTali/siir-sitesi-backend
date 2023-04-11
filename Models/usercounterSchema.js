import mongoose from "mongoose";

const usercounterSchema = mongoose.Schema({
    id:{
        type: String
    },
    seq:{
        type: Number,
    }
})

export default mongoose.model("usercounter",usercounterSchema)