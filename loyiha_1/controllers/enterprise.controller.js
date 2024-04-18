const Enterprise = require('../models/enterprise.models')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/error.response')

// register enterprise 
exports.register = asyncHandler(async (req, res, next) => {
    const { inn, password, name } = req.body;

    // 1. So'rov parametrlarini tekshirish
    if (!inn || !password || !name) {
        return next(new ErrorResponse('All fields are required', 400));
    }

    // 2. Tegishli inn va nom bilan enterprise ni izlash
    const existingEnterpriseName = await Enterprise.findOne({ name });
    const existingEnterpriseInn = await Enterprise.findOne({ inn });

    // 3. Nom va inn unikalligini tekshirish
    if (existingEnterpriseName) {
        return next(new ErrorResponse('Name already in use', 400));
    }

    if (existingEnterpriseInn) {
        return next(new ErrorResponse('Inn already in use', 400));
    }
    
    // 4. Parol uzunligini tekshirish 
    if(password.length < 6) {
        return next(new ErrorResponse('password length must not be less than 6 characters', 400))
    }

    // 5. Yangi foydalanuvchini yaratish
    const enterprise = await Enterprise.create({
        name,
        inn,
        password
    });

    // 5. Muvaffaqiyatli javob qaytarish
    res.status(201).json({
        success: true,
        data: enterprise
    });
});

// login enterprise 
exports.login = asyncHandler(async (req, res, next) => {
    const { name, password } = req.body;

    // Ma'lumot bazasidan foydalanuvchi obyektini izlash
    const enterprise = await Enterprise.findOne({ name });

    // Agar foydalanuvchi topilmasa, xato yuborish
    if (!enterprise) {
        return next(new ErrorResponse('Incorrect data entered', 403));
    }

    // Parolni tekshirish
    const isPasswordMatched = await enterprise.matchPassword(password);

    // Agar parol mos kelmasa, xato yuborish
    if (!isPasswordMatched) {
        return next(new ErrorResponse('Incorrect password entered', 403));
    }

    // JWT token yaratish
    const token = enterprise.jwtToken();
    
    // Foydalanuvchining ma'lumotlari va tokenni javob sifatida qaytarish
    res.status(200).json({
        success: true,
        enterprise,
        token
    });
});
