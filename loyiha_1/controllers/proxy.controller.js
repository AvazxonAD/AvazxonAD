const Proxy = require('../models/proxy.models')
const Enterprise = require('../models/enterprise.models')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/error.response')

// add new proxy 
exports.createProxy = asyncHandler(async (req, res, next) => {
    const {
        proxyNumber,
        dateHead,
        dateEnd,
        agreementNumber ,
        dateAgreement ,
        myEnterpriseInn ,
        hisEnterpriseInn ,
        myEnterpriseName ,
        myAccountNumber ,
        mySWFT,
        myAddress ,
        myBoss ,
        hisEnterpriseName ,
        hisAccountNumber ,
        hisSWFT,
        hisAddress ,
        hisBoss ,
        ReliableJSHR ,
        ReliableFIO ,
        ReliablePosition,
        ReliablePassport,
        GivenByWhom,
        givenDate,
        goods,
    } = req.body
    // malumotlar bosh emasligiga ishonch hosil qilish 
    if (!proxyNumber || 
        !dateHead || 
        !dateEnd || 
        !agreementNumber  || 
        !dateAgreement  || 
        !myEnterpriseInn  || 
        !hisEnterpriseInn  || 
        !myEnterpriseName  || 
        !myAccountNumber  || 
        !mySWFT  || 
        !myAddress  || 
        !myBoss  || 
        !hisEnterpriseName  || 
        !hisAccountNumber  || 
        !hisSWFT  || 
        !hisAddress  || 
        !hisBoss  || 
        !ReliableJSHR  || 
        !ReliableFIO  || 
        !ReliablePosition || 
        !ReliablePassport || 
        !GivenByWhom || 
        !givenDate || 
        !goods){
        return next(new ErrorResponse('All fields are required', 400));
    }    
    if(!req.user){
        return next(new ErrorResponse('Please login if you are not registered ', 403))
    }
    const enterprise = await Enterprise.findById({_id : req.user._id})
    if(!enterprise){
        return next(new ErrorResponse("The token was incorrectly sent", 403))
    }
    if(parseInt(myEnterpriseInn) !== enterprise.inn){
        return next(new ErrorResponse('Your enterprise inn number was entered incorrectly'))
    }
    // malumotni database ga yukalash 
    const proxy = await Proxy.create({
        proxyNumber,
        dateHead,
        dateEnd,
        agreementNumber ,
        dateAgreement ,
        myEnterpriseInn ,
        hisEnterpriseInn ,
        myEnterpriseName ,
        myAccountNumber ,
        mySWFT ,
        myAddress ,
        myBoss ,
        hisEnterpriseName ,
        hisAccountNumber ,
        hisSWFT,
        hisAddress ,
        hisBoss ,
        ReliableJSHR ,
        ReliableFIO ,
        ReliablePosition,
        ReliablePassport,
        GivenByWhom,
        givenDate,
        goods,
        enterpriseId : req.user._id
    })

    await Enterprise.findOneAndUpdate({name : req.user.name}, 
        {$push : {proxy : proxy._id}},
        {new : true, upsert : true}
        )
    
    res.status(200).json({
        success : true,
        proxy
    })
})
// get all proxy 
exports.getAllProxy = asyncHandler(async (req, res, next) => {
    //pagination
    const pageLimit = process.env.PAGE_LIMIT || 2
    const limit = parseInt(req.query.limit || pageLimit)
    const page = parseInt(req.query.page) || 1
    
    if(!req.user){
        return next(new ErrorResponse('Unregistered user'))
    }
    const proxy = await Proxy
        .find({enterpriseId : req.user._id})
        .skip((page * limit) - limit)
        .limit(limit)

    // pagination count
    const proxyLength = await Proxy.find({enterpriseId : req.user._id})
    
    const total = proxyLength.length
    
    res.status(200).json({
        success : true,
        pageCount: Math.ceil(total/limit),
        currentPage: page,
        nextPage: Math.ceil(total/limit) < page + 1 ? null : page + 1,
        data : proxy.reverse()
    })
})
// delete proxy 
exports.deleteProxy  = asyncHandler(async (req, res, next) => {
    const enterprise = await Enterprise.findById(req.user._id)
    if(!enterprise){
        return next(new ErrorResponse('Unregistered user'))
    }
    await Proxy.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success : true,
        data : "Delete proxy"
    })
})

// inn orqali oldin kiritlgan proxyni topish 
// proxyni kirgazayotganda qulaylik bolishi uchun 
// hamkor enterpriseni qidirish 
exports.openSearchInnPartner = asyncHandler(async (req, res, next) => {
    const partner = await Proxy.findOne({hisEnterpriseInn : parseInt(req.body.partnerInn)})
    const hisEnterprise = {}
    if(!partner){
        return next(new ErrorResponse('Partner enterprise not found', 400))
    }
    hisEnterprise.hisEnterpriseName = partner.hisEnterpriseName
    hisEnterprise.hisAccountNumber = partner.hisAccountNumber
    hisEnterprise.hisSWFT = partner.hisSWFT
    hisEnterprise.hisAddress = partner.hisAddress
    hisEnterprise.hisBoss = partner.hisBoss
    return res.status(200).json({
        success : true,
        data : hisEnterprise
    })
})

// inn orqali oldin kiritlgan proxyni topish 
// proxyni kirgazayotganda qulaylik bolishi uchun 
// ozimizni  korxonani qidirish 
exports.openSearchInnMy = asyncHandler(async (req, res, next) => {
    const I = await Proxy.findOne({myEnterpriseInn : parseInt(req.body.myInn)})
    const myEnterprise = {}
    if(!I) {
        return next(new ErrorResponse('Our inn number is not', 400)) 
    }
    myEnterprise.myEnterpriseName = I.myEnterpriseName
    myEnterprise.myAccountNumber = I.myAccountNumber
    myEnterprise.mySWFT = I.mySWFT
    myEnterprise.myAddress = I.myAddress
    myEnterprise.myBoss = I.myBoss
    res.status(200).json({
        success : true,
        data : myEnterprise
    })
})