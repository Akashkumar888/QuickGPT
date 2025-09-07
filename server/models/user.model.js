import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength:6,
      select:false
    },
    credits: {
      type: Number,
      default: 20,
    },
  },
  { timestamps: true }
);

// Hash password before saving
// Pre-save hook ensures you never store plain text passwords.
// Use pre('save') for password hashing + instance methods for comparison & token generation.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// // user hash password
// userSchema.statics.hashPassword=async function (password) {
//   const salt=await bcrypt.genSalt(10);
//   const hash=await bcrypt.hash(password,salt);
//   return hash;
// }


// Compare password (instance method)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token (instance method)
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d", // expiry is best practice
  });
};


const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;

