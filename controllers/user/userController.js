const User=require('../../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const config=require('../../utils/config')
const randomstring=require('randomstring');

const SECRET_KEY=config.SECRET_KEY;

const userController={

    //Signup and generate activation link with token
    signup:async(req,res)=>{
        try{
            const {name,email,password} = req.body;
            console.log(name,email)
            //check if the user already exists
            const existingUser=await User.findOne({email});
            
            if(existingUser){
                return res.status(409).json({message:'User already exists'});
            }   

            //create randomstring for account activation                  
            let token = randomstring.generate({
                length: 16,
                charset: "alphanumeric",
            });
        
            //creating expiry after 1 hour
            let expiry = new Date(Date.now() + 3600 * 1000);

            //hash the password before savingg
            const hashedPassword =await bcrypt.hash(password,10);

            //create new USer

            const newUser=new User({
                name,
                email,
                password :hashedPassword,
                resetExpiry:expiry,
                resetToken:token,
            });

            //save the user
            await newUser.save();

            res.status(201).json({message:"User created success"})

        }
        catch(error){
            console.error('Error sending link to Email',error)

        }
    },

    //Signin process and generate JWT Token
    signin: async(req,res)=>{
        try{
            const {email,password}=req.body;

            //find the user by email
            const user=await User.findOne({email});

            if(!user){
                return res.status(401).json({message: 'Authentication Failed'});
            }
            //compare passwords

            const passwordMatch=await bcrypt.compare(password,user.password);

            if(!passwordMatch)
            {
                return res.status(401).json({message: 'Authentication Failed'});
            }

            //generate and send the jwt token 

            const token=jwt.sign({userId:user._id},SECRET_KEY,{expiresIn:'1h'});
            res.json({token});
        }
        catch(error)
        {
            console.log('Error signing in user', error);
            res.status(500).json({message: 'Internal Server error'});
        }
    },

    getAllIds:async(req,res) =>{
        try{
            console.log(req.params.id)
            const users = await User.find({ _id: { $ne: req.params.id } }).select([
                "email",
                "name",
                // "avatarImage",
                "_id",
              ]);
              console.log(users)
              return res.json(users);
        }
        catch(error)
        {
            console.log("Error in fetching all user details");
            res.status(500).json({message: 'Error in fetching all user details'});
        }
    },

    setAvatar:async(req,res)=>{
        try {
            const userId = req.params.id;
            const avatarImage = req.body.image;
            const userData = await User.findByIdAndUpdate(
              userId,
              {
                isAvatarImageSet: true,
                avatarImage,
              },
              { new: true }
            );
            return res.json({
              isSet: userData.isAvatarImageSet,
              image: userData.avatarImage,
            });
          } catch (ex) {
            next(ex);
          }

    },

   
}

module.exports=userController;