const mongoose = require('mongoose')

const proxySchema = new mongoose.Schema({
    proxyNumber : {
        type : Number,
        required: true
    },
    dateHead: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true,
    },
    agreementNumber : {
        type : Number,
        required : true
    },
    dateAgreement : {
        type : Date,
        required : true
    },
    myEnterpriseInn : {
        type : Number,
        required : true
    },
    hisEnterpriseInn : {
        type : Number,
        required : true
    },
    myEnterpriseName : {
        type : String,
        required :  true
    },
    myAccountNumber : {
        type : Number,
        required : true
    },
    mySWFT : {
        type : Number,
        required : true
    },
    myAddress : {
        type : String,
        required : true
    },
    myBoss : {
        type : String,
        required : true
    },
    hisEnterpriseName : {
        type : String,
        required :  true
    },
    hisAccountNumber : {
        type : Number,
        required : true
    },
    hisSWFT : {
        type : Number,
        required : true
    },
    hisAddress : {
        type : String,
        required : true
    },
    hisBoss : {
        type : String,
        required : true
    },
    ReliableJSHR : {
        type : Number,
        required : true
    },
    ReliableFIO : {
        type : String,
        required : true
    },
    ReliablePosition : {
        type : String,
        required : true
    },
    ReliablePassport : {
        type : Number,
        required : true
    },
    GivenByWhom : {
        type : String,
        required : true
    },
    givenDate : {
        type : Date,
        required : true
    },
    goods : [{
        productCatalog : String,
        productName : String,
        UnitOfMeasure : String,
        amount : Number
    }],
    enterpriseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "enterprise",
        required : true
    }
}, {timestamps : true}
)

module.exports = mongoose.model('proxy', proxySchema)