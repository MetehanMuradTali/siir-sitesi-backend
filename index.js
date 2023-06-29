import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import bcrypt from "bcryptjs"
import User from "./Models/userSchema.js"
import Post from './Models/postSchema.js';
import Comment from './Models/commentSchema.js'
import CommentCounter from './Models/commentcounterSchema.js'
import PostCounter from './Models/postCounterSchema.js'



const app = express();

dotenv.config()
app.use(cors())
app.use(express.json())

app.listen(4000,function(){
    mongoose.connect(process.env.MongoDB_Url).then(console.log("Veri tabanına bağlanma başarılı")).catch(err=> console.log(err))
})
app.use("/Cronjob",async (req,res)=>{
    console.log("server is not frozen")
    res.json({message:"server is not frozen"})
})
app.post("/User/Register",async (req,res)=>{
    const isim = req.body.isim
    const sifre = req.body.sifre
    User.findOne({isim:isim}).then(async data=>{
        if(data){
            res.json({error:"kullanıcı ismi alınmış"})   
        }
        else{
            const hashedsifre=await bcrypt.hash(sifre,6);
            await User.create({isim,sifre:hashedsifre}).then(newUser=>{
                console.log("kullanici oluşturma başarili")
                res.json(newUser)
            }).catch(err=>{
                res.json({error:"şifre hatalı"})   
            })
          
        }
    })
})
app.post("/User/Login",async (req,res)=>{
    const {isim,sifre} = req.body;
    const foundUser = await User.findOne({isim})
    if(!foundUser){
        res.json({error:"kullanıcı ismi hatalı"})   
    }
    else{
        const  isPasswordCorrect = await bcrypt.compare(sifre,foundUser.sifre)
        if(!isPasswordCorrect){
            res.json({error:"şifre hatalı"})   
        }
        else{
            res.json(foundUser)
        }
    }
    
})
app.post("/User/Post",async (req,res)=>{
    const {id} = req.body;
    Post.findOne({id:parseInt(id)}).then(data=>{console.log(data);res.status(200).json({"post":data})}).catch(err=>{console.log(err)})
})
app.post("/User/Posts",async (req,res)=>{
    const pagination = 2 ;
    const {pageNumber} = req.body;
    console.log(pageNumber)
    Post.find({}).sort({"id" : "descending"}).skip((pageNumber-1)*pagination).limit(pagination).then(data=>{res.status(200).json({"postlar":data})}).catch(err=>{console.log(err)})
})
//


app.post("/User/AllPost",async (req,res)=>{
    const pagination = 20 ;
    const {pageNumber} = req.body;
    Post.find({}).sort({"id" : "descending"}).skip((pageNumber-1)*pagination).limit(pagination).then(data=>{res.status(200).json({"postlar":data})}).catch(err=>{console.log(err)})
})
app.post("/Admin/Post",async (req,res)=>{
    const {id} = req.body;
    Post.findOne({id:parseInt(id)}).then(data=>{console.log(data);res.status(200).json({"post":data})}).catch(err=>{console.log(err)})
})
app.post("/Admin/AllPost",async (req,res)=>{
    const pagination = 20 ;
    const {pageNumber} = req.body;
    Post.find({}).sort({"id" : "descending"}).skip((pageNumber-1)*pagination).limit(pagination).then(data=>{res.status(200).json({"postlar":data})}).catch(err=>{console.log(err)})
})
app.use("/Admin/Delete_Post",async (req,res)=>{
    const {post_id} = req.body;
    Post.findOneAndDelete({id:post_id}).then((deleted_value=>{
        if(deleted_value){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }
    }))
})
app.use("/Admin/Update_Post",async (req,res)=>{
    const {FormData} = req.body
    Post.findOneAndUpdate({id:FormData.post_id},{baslik:FormData.post_baslik,icerik:FormData.post_icerik},{new:true}).then((updated_value=>{
        if(updated_value){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }
    }))
})
app.use("/Admin/Create_Post",async (req,res)=>{
    const {FormData} = req.body
    PostCounter.findOneAndUpdate({id:"autoval"},{"$inc":{"seq":1}},{new:true}).then(async (cd)=>{
        let seqId;
        if(cd==null){
            const newval = new PostCounter({id:"autoval",seq:1})
            newval.save();
            seqId=1;
        }
        else{
            seqId=cd.seq
        }
        const newPost = await Post.create({id:seqId,baslik:FormData.post_baslik,icerik:FormData.post_icerik})
        if(newPost){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }
    }) 
})
app.use("/User/Add_Comment",async (req,res)=>{
    const {comment,id,kullaniciIsim} = req.body;
    
    CommentCounter.findOneAndUpdate({id:"autoval"},{"$inc":{"seq":1}},{new:true}).then(async (cd)=>{
        let seqId;
        if(cd==null){
            const newval = new CommentCounter({id:"autoval",seq:1})
            newval.save();
            seqId=1;
        }
        else{
            seqId=cd.seq
        }
        const newComment = await Comment.create({id:seqId,yorum:comment,kullaniciIsim:kullaniciIsim,postId:id})
        if(newComment){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }
    }) 
})
app.use("/Admin/Delete_Comment",async (req,res)=>{
    const {comment_id} = req.body;
    Comment.findOneAndDelete({id:comment_id}).then((deleted_value=>{
        if(deleted_value){
            res.json({success:true})
        }
        else{
            res.json({success:false})
        }
    }))
})
app.use("/User/Get_Comments",async (req,res)=>{
    const {id} = req.body;
    Comment.find({postId:id}).then(data=>{
        if(data.length!=0){
            res.json({yorumlar:data})
        }
        else{
            res.json({answer:"yorum yok"})
        }
    })  
})
