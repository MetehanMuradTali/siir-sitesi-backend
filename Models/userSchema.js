import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    isim:{
        type: String,
        required: true
    },
    sifre:{
        type: String,
        required: true
    },
    yorumlar:{
        type: []
    },
    begeniler:{
        type:[]
    }
})

export default mongoose.model("UserModel",userSchema)