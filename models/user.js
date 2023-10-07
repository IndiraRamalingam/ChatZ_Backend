const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    activated:{
        type:Boolean,
        default:false
    },
    resetToken : String,
    resetExpiry : Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
    url:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Url'
    }],
})

module.exports=mongoose.model('User',userSchema,'users');