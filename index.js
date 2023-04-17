import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import admin from "./Models/adminSchema.js"
import user from "./Models/userSchema.js"
import PostModel from "./Models/postSchema.js";
import UserModel from "./Models/userSchema.js"
import counter from "./Models/counterSchema.js"
import usercounter from "./Models/usercounterSchema.js";
import cors from "cors"
import bcrypt from "bcryptjs"
const app = express();

dotenv.config()
app.use(cors())
app.use(express.json())

app.listen(4000,function(){
    mongoose.connect(process.env.MongoDB_Url).then(console.log("Veri tabanına bağlanma başarılı")).catch(err=> console.log(err))
})

app.post("/admin_giris",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("admin sayfası giriş butonuna basıldı")
    const {isim,sifre} = req.body;
    const user = await admin.findOne({isim,sifre})
    if(user){
        console.log(user,"admin şifre ve isim doğru")
        res.status(200).json({user,message:"admin şifre ve isim doğru"})
    }
    else{
        res.status(400).send({message:"admin şifre veya isim yanlış"})   
    } 
})

app.post("/admin_post_create",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("post oluşturma isteği geldi");
    const {baslik,icerik} = req.body;

    counter.findOneAndUpdate({id:"autoval"},{"$inc":{"seq":1}},{new:true},async (err,cd)=>{
        let seqId;
        if(cd==null){
            const newval = new counter({id:"autoval",seq:1})
            newval.save();
            seqId=1;
            console.log("post id oluşturuldu => "+seqId)
        }
        else{
            
            seqId=cd.seq
            console.log("post id oluşturuldu => "+seqId)
        }

        const newPost = await PostModel.create({baslik,icerik,id:seqId})
        if(newPost){
            console.log("post oluşturma başarili")
            console.log(newPost)
            res.status(201).json(newPost)
        }
        else{
            res.status(400).send({meesage:"post oluşturulamadi"})
        }
    })    
})
app.post("/user/login",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("user sayfası giriş butonuna basıldı")
    const {isim,sifre} = req.body;
    const foundUser = await user.findOne({isim})
    if(!foundUser){
        res.status(418).send({message:"kullanıcı ismi hatalı"})   
    }
    const  isPasswordCorrect = await bcrypt.compare(sifre,foundUser.sifre)
    if(!isPasswordCorrect){
        res.status(418).send({message:"şifre hatalı"})   
    }
    return res.status(200).send(foundUser,{message:"giriş başarılı"})
})

app.post("/user/register",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("kayıt olma isteği geldi");
    const {isim,sifre} = req.body;
    
    const foundUser = user.findOne({isim:isim}).then(data=>{
        if(data){
            res.status(418).send({meesage:"Kullanıcı ismi alınmış.Başka kullanici ismi seçin"})
        }
        else{
            usercounter.findOneAndUpdate({id:"autoval"},{"$inc":{"seq":1}},{new:true},async (err,cd)=>{
                let seqId;
                if(cd==null){
                    const newval = new usercounter({id:"autoval",seq:1})
                    newval.save();
                    seqId=1;
                    console.log("kullanici id oluşturuldu => "+seqId)
                }
                else{
                    
                    seqId=cd.seq
                    console.log("kullanici id oluşturuldu => "+seqId)
                }
                const hashedsifre=await bcrypt.hash(sifre,6);
                const newUser = await UserModel.create({isim,sifre:hashedsifre,id:seqId})
                if(newUser){
                    console.log("kullanici oluşturma başarili")
                    console.log(newUser)
                    res.status(201).json(newUser)
                }
                else{
                    res.status(400).send({meesage:"kullanıcı oluşturulamadi"})
                }
            })    
        }
    })
})
app.use("/user/get_one_post",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    const {id} = req.body;
    PostModel.findOne({id:id}).then(data=>{res.status(200).send({"post":data})}).catch(err=>{console.log(err)})
})
app.use("/user/get_posts",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    const pagination = 8 ;
    const {pageNumber} = req.body;
    PostModel.find({}).sort({"id" : "descending"}).skip((pageNumber-1)*pagination).limit(pagination).then(data=>{res.status(200).send({"postlar":data})}).catch(err=>{console.log(err)})
})
app.use("/user/get_lots_posts",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    const pagination = 30 ;
    const {pageNumber} = req.body;
    PostModel.find({}).sort({"id" : "descending"}).skip((pageNumber-1)*pagination).limit(pagination).then(data=>{res.status(200).send({"postlar":data})}).catch(err=>{console.log(err)})
})

app.use("/user/get_comments",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("Yorumlar Yükleniyor");
    const {id} = req.body;
    PostModel.findOne({id:id}).then(data=>{res.status(200).send({"yorumlar":data.yorumlar})}).catch(err=>{console.log(err)})
})
app.use("/user/post_comment",async (req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true")
    console.log("user sayfasında yorum yapma isteği geldi")
    const {yorum,id,kullaniciId,kullaniciIsim} = req.body;
    PostModel.findOneAndUpdate({id:id},{$push:{yorumlar:{kullaniciId:kullaniciId,yorum:yorum,kullaniciIsim:kullaniciIsim}}}).then(
        UserModel.findOneAndUpdate({id:kullaniciId},{$push:{yorumlar:{postid:id,yorum:yorum}}}).then(res.status(201).send({"sonuc":"yorumunuz-başarili"})).catch(err=>{console.log(err)})
        ).catch(err=>{console.log(err)})
})
