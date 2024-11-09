const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const { User, Cv } = require("../database/databaseConfig");
const generateAcessToken = require('../utils/utils').generateAcessToken


Cv.find().then(data=>{
   console.log(data)
})


module.exports.getUserFromJwt = async (req, res, next) => {
   try {
      let token = req.headers["header"]

      if (!token) {
         throw new Error("a token is needed ")
      }
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
      const user = await User.findOne({ email: decodedToken.email })

      if (!user) {
         //if user does not exist return 404 response
         return res.status(404).json({
            response: "user has been deleted"
         })
      }

      return res.status(200).json({
         response: {
            user: user,
         }
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }

}

module.exports.signup = async (req, res, next) => {
   try {
      //email verification
      let { email, password } = req.body
      //check if the email already exist
      let userExist = await User.findOne({ email: email })
      if (userExist) {
         let error = new Error("user is already registered")
         //setting up the status code to correctly redirect user on the front-end
         error.statusCode = 301
         return next(error)
      }
      //email API gets call 
      let accessToken = generateAcessToken(email)
      if (!accessToken) {
         let error = new Error("acess token error")
         return next(error)
      }

      //hence proceed to create models of user and token
      let newUser = new User({
         _id: new mongoose.Types.ObjectId(),
         email: email,
         password: password,
      })

      let savedUser = await newUser.save()
      if (!savedUser) {
         //cannot save user
         let error = new Error("user could not be saved")
         return next(error)
      }

      //create acess token to send to front-end
      let token = generateAcessToken(savedUser.email)
      return res.status(200).json({
         response: 'successfully registered',
         user: savedUser,
         userToken: token,
         userExpiresIn: '500',
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)
   }
}
//sign in user with different response pattern
module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body

      console.log(req.body)
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         return res.status(404).json({
            response: "user is not yet registered"
         })
      }

      //check if password corresponds
      if (userExist.password != password) {
         let error = new Error("Password does not match")
         return next(error)
      }


      //checking forphone or email verified



      let token = generateAcessToken(email)

      return res.status(200).json({
         response: {
            user: userExist,
            userToken: token,
            userExpiresIn: '500',
            message: 'Login success'
         }
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.allCvs = async (req, res, next) => {
   try {
      console.log(req.params)
      let { id } = req.params
      let cvExist = await Cv.find({ user: id })
      if (!cvExist) {
         return res.status(404).json({
            response: "No cv yet"
         })
      }
      return res.status(200).json({
         cvs:cvExist
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }


}
 


module.exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.params.id; // Assuming the user's ID is passed in the route as a parameter
    const { fullName, email, phone, username, password, jobTitle, company, paymentInfo } = req.body; // Destructuring updated user info from the request body

    // Check if the user exists
    let user = await User.findById(id);
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if email or username already exists (ignoring current user)
    let emailExist = await User.findOne({ email: email, _id: { $ne: id } });
    if (emailExist) {
      let error = new Error("Email already in use");
      error.statusCode = 409;
      return next(error);
    }

    let usernameExist = await User.findOne({ username: username, _id: { $ne: id } });
    if (usernameExist) {
      let error = new Error("Username already taken");
      error.statusCode = 409;
      return next(error);
    }

    // Update user fields only if they exist in the request
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (username) user.username = username;
    if (password) user.password = password; // Ideally, you should hash the password before saving
    if (jobTitle) user.jobTitle = jobTitle;
    if (company) user.company = company;
    if (paymentInfo) {
      user.paymentInfo = {
        cardNumber: paymentInfo.cardNumber || user.paymentInfo.cardNumber,
        expiryDate: paymentInfo.expiryDate || user.paymentInfo.expiryDate,
        cvv: paymentInfo.cvv || user.paymentInfo.cvv,
        billingAddress: paymentInfo.billingAddress || user.paymentInfo.billingAddress
      };
    }

    // Save the updated user info to the database
    let updatedUser = await user.save();
    if (!updatedUser) {
      let error = new Error("Failed to update user");
      return next(error);
    }

    // Send back updated user data
    return res.status(200).json({
      message: 'User account updated successfully',
      user: updatedUser
    });
  } catch (error) {
    error.message = error.message || "An error occurred while updating the account";
    return next(error);
  }
};




module.exports.createCv = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {
      name, jobTitle, phone, email, location, profile, linkedin, socialMedia, summary,
      education, experiences, workExperience, researchExperience, publications,
      awards, achievements, certifications, skills, cvTemplateType
    } = req.body; 

    // Check if the user exists
    let user = await User.findById(id);
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Create a new CV document using the CV schema
    let newCv = new Cv({
      name,
      jobTitle,
      phone,
      email,
      location,
      profile,
      linkedin,
      socialMedia,
      summary,
      education, 
      experiences,
      workExperience, 
      researchExperience, 
      publications, 
      awards, 
      achievements, 
      certifications, 
      skills, 
      cvTemplateType, 
      user: user._id // Link the CV to the user who created it
    });

    // Save the new CV to the database
    let savedCv = await newCv.save();
    if (!savedCv) {
      let error = new Error("Failed to create CV");
      return next(error);
    }

    // Send a success response with the saved CV
    return res.status(200).json({
      message: "CV created successfully",
      cv: savedCv
    });

  } catch (error) {
    error.message = error.message || "An error occurred while creating the CV";
    return next(error);
  }
};


