const mongoose = require("mongoose")

/* mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, // This is to handle deprecation of ensureIndex }) */

mongoose.connect(process.env.DB_STRING)
.then(() => {
    console.log("connected to database")
})
.catch((err) => console.log(`Error: ${err}`));

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    paymentInfo: {
      cardNumber: {
        type: String,
        trim: true,
      },
      expiryDate: {
        type: String,
        trim: true,
      },
      cvv: {
        type: String,
        trim: true,
      },
      billingAddress: {
        type: String,
        trim: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
const cvSchema = new mongoose.Schema({
    name: { type: String },  // Already present
    jobTitle: { type: String },  // From second useState
    phone: { type: String },  // Already present
    email: { type: String },  // Already present
    location: { type: String },  // Already present
    profile: { type: String },  // From first useState
    linkedin: { type: String },  // Already present
    socialMedia: { type: String },  // From second useState
    summary: { type: String },  // From second useState

    education: [{
        degree: { type: String },  // Already present
        institution: { type: String },  // Already present
        year: { type: String },  // From second and third useState
        details: { type: String },  // From second and third useState
        duration: { type: String }  // Already present
    }],

    experiences: [{
        title: { type: String },  // Already present
        company: { type: String },  // Already present
        duration: { type: String },  // Already present
        location: { type: String },  // Already present
        responsibilities: [{ type: String }]  // Already present
    }],

    workExperience: [{
        title: { type: String },  // Already present
        company: { type: String },  // Already present
        duration: { type: String },  // Already present
        responsibilities: [{ type: String }]  // Already present
    }],

    researchExperience: [{
        role: { type: String },  // From third useState
        institution: { type: String },  // From third useState
        duration: { type: String },  // Already present
        description: { type: String }  // From third useState
    }],

    publications: [{
        title: { type: String },  // From third useState
        journal: { type: String },  // From third useState
        year: { type: String },  // From third useState
        pages: { type: String }  // From third useState
    }],

    awards: [{
        title: { type: String },  // Already present
        institution: { type: String },  // From third useState
        organization: { type: String },  // From second useState
        year: { type: String },  // Already present
        location: { type: String }  // Already present
    }],

    achievements: [{ description: { type: String } }],  // From second useState

    certifications: [{ type: String }],  // Already present

    skills: {
        R: { type: String },  // From third useState
        Spanish: { type: String },  // From third useState
        Mandarin: { type: String },  // From third useState
        generalSkills: { type: String }  // Already present
    },
    cvTemplateType:{ type: String },
    // Reference to the user who created the CV
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


const Cv = mongoose.model('Cv', cvSchema);
let User = new mongoose.model("User", userSchema)

module.exports.Cv = Cv;
module.exports.User = User