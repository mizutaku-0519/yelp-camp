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
    UserExistsError: "すでに登録済みのユーザーです",
    IncorrectPasswordError: "ユーザー名またはパスワードが間違っています",
    IncorrectUsernameError: "ユーザー名またはパスワードが間違っています",
    MissingUsernameError: "ユーザーが存在しません",
  },
});

module.exports = mongoose.model("User", userSchema);
