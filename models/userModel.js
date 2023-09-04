

const mongoose =require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true},
        isAdmin: { type: Boolean, default: false, required: true},
        socialLogin: { type: Boolean, default: false, required: true},
        socialProvider: { type: String},
        image: { type: String, required: true, default: "image"},
        profession:{type: String}
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;