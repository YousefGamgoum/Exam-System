const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
    unique: [true, "This name is already in use."],
    min: [3, "must at least 3 character"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "This email is already in use."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._-]{3,15}(@)(gmail|yahoo)(.com)$/.test(v);
      },
      message: () => "Invaild Email",
    },
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (pass) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_/@#$%^&*!])[a-zA-Z\d-_/@#$%^&*!]{8,20}$/.test(
          pass
        );
      },
    },
    message:
      "Password must be 8-20 characters and contain a mix of lowercase, uppercase, numbers, and special characters (-_/!@#$%^&*).",
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
});

// encryption pass beefore save
userSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  const hashPass = await bcryptjs.hash(this.password, salt);

  this.password = hashPass;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
