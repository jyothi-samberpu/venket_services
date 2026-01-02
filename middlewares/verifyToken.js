const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();




const secretKey = process.env.WHATISYOURWORK;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }
  try{
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Access Denied: Invalid Token' });
    }

    req.vendor = vendor._id;
    next();
    
  } catch (message){
    console.message(message)

    return res.status(500).json({ message: 'Access Denied: Invalid Token' });
}
}

module.exports = verifyToken;