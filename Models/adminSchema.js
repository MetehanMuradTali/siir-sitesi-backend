import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    isim:{
        type: String,
        required: true
    },
    sifre:{
        type: String,
        required: true
    },
    aktiflik:{
        type: Boolean,
        enum:[true,false],
        default:true
    }
})

export default mongoose.model("AdminModel",adminSchema)