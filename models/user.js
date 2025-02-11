const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose, {
  errorMessages: {
    IncorrectUsernameError: "ユーザー名またはパスワードが間違っています",
    IncorrectPasswordError: "ユーザー名またはパスワードが間違っています",
    UserExistsError: "すでに存在しているユーザーです",
  },
});

module.exports = mongoose.model("User", userSchema);
