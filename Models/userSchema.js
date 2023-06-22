import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    isim:{
        type: String,
        required: true
    },
    sifre:{
        type: String,
        required: true
    },
    role:{
        type:String,
        default:"user",
        required:true,
    }
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;