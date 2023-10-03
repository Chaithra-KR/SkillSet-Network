const jwt = require('jsonwebtoken');

const UserAuth =(req,res,next)=>{
    try {
        const tokenWithBearer = req.headers['authorization'];
        const token = tokenWithBearer.split(' ')[1];
        jwt.verify(token,process.env.SECRET_KEY,(err,encoded)=>{
            if(err){
                return res.status(401).send({message:"Auth failed",success:false})
            }else if (encoded.role === 'seeker') {
          req.id = encoded.id;
          next();
        }
        })
    } catch (error) {   
      console.log(error.message);
    }
}

module.exports = {
    UserAuth
  }