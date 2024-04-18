const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const enterpriseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    inn: {
        type: Number,
        required: true,
        unique: true
    },
    proxy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'proxy'
    }]
}, {
    timestamps: true
})

// hashing password 
enterpriseSchema.pre('save', async function(next) {
    if (!this.isModified) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// match password 
enterpriseSchema.methods.matchPassword = async function(parol) {
    return await bcrypt.compare(parol, this.password)
}
// jwt  token  
enterpriseSchema.methods.jwtToken = function() {
    return jwt.sign({id : this._id, name : this.name}, process.env.JWT_TOKEN_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    })
} 

module.exports = mongoose.model("enterprise", enterpriseSchema);
