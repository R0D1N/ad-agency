const Router = require("express");
const Advertiser = require("../models/advertiser");
const {check, validation_result} = require("express-validator");
const bcrypt = require("bcryptjs");
const router = new Router();

router.post('/registration',
[
  check("email", "Uncorrect email").isEmail(),
  check("password", "Uncorrect password >3 <12").isLength({min: 3, max:12})
],
async (req, res) => {

  const errors = validation_result(req);
  if(!errors.isEmpty()){
    return res.status(400).json({message: "Uncorrect request", errors})
  }

  try {
    const {email, password} = req.body;
    const candidate = advertiser.findOne({email});
    
    if(candidate){
      return res.status(400).json({message: `User with email ${email} already exist`});
    }
    
    const hash_password = await bcrypt.hash(password, 15);
    const advertiser = new Advertiser({email, password: hash_password});
    await advertiser.save();
    return res.json({message: `User was created with ${email} and ${password} = ${hash_password}`})

  } catch (error) {
    console.log(error);
    res.send({message: "server error"});
  }
})

module.exports = router;