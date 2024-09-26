import {Request , Response} from "express";
import md5 from "md5";
import { generateRandomNumber, generateRandomString } from "../helpers/generate";
import User from "../models/user.model";

import ForgotPassword from "../models/forgot-password.model";
import sendMailHelper from "../helpers/sendmail";


// [POST]/api/v1/users/register
export const register = async (req : Request ,res : Response) => {
    req.body.password = md5(req.body.password);

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            token : generateRandomString(20),
        });

        await user.save();

        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token
        });
    };
};

// [POST]/api/v1/users/login
export const login = async (req : Request ,res : Response) => {
    const password : string = req.body.password;

    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }
    if (md5(password) !== user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu !"
        });
        return;
    }
    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công!",
        token: token
    });

};

// [GET]/api/v1/users/detail/
export const detail = async (req : Request ,res : Response) => {
    
    res.json({
            code: 200,
            message : "Thành công" ,
            info :  req[`user`]
        });
    
};


// // [POST]/api/v1/users/password/forgot
// export const forgotPassword = async (req : Request ,res : Response) => {
//     const email : string = req.body.email;

//     const user = await User.findOne({
//         email: req.body.email,
//         deleted: false
//     });

//     if (!user) {
//         res.json({
//             code: 400,
//             message: "Email không tồn tại!"
//         });
//         return;
//     }
//     const otp = generateRandomNumber(8);

//     const timeExpire = 5;

//     const objectForgotPassword = {
//         email: email,
//         otp: otp,
//         expireAt: Date.now() + timeExpire * 60 * 1000,
//     };

//     const forgotPassword = new ForgotPassword(objectForgotPassword);
//     await forgotPassword.save();

//     //  Send otp
//     const subject : string = "Mã OTP xác minh mật khẩu"
//     const html: string = `
//       Mã OTP để xác nhận mật khẩu của bạn là <b>${otp}</b> . 
//       Thời gian hết hạn là ${timeExpire} phút .
//     `
//     sendMailHelper(email , subject , html)
//     res.json({
//         code: 200,
//         message : "đã gửi otp thành công"
//     });

// };

// // [POST]/api/v1/users/password/otp
// export const otpPassword = async (req : Request ,res : Response) => {
//     const email = req.body.email;
//     const otp = req.body.otp;

//     const result = await ForgotPassword.findOne({
//         email: email,
//         otp : otp
//     });

//     if (!result) {
//         res.json({
//             code: 400,
//             message: "OTP không hợp lệ!"
//         });
//         return;
//     }

//     const user = await User.findOne({
//         email: email,
//     });

//     const token = user.token;
//     res.cookie("token", token);
    
//     res.json({
//         code: 200,
//         message : "Xác thực thành công" ,
//         token : token 
//     });

// };

// // [POST]/api/v1/users/password/reset
// export const resetPassword = async (req : Request ,res : Response) => {
//     const token = req.body.token;
//     const password = req.body.password;
    
//     const user = await User.findOne({
//         token: token,
//     });

//     if (md5(password) == user.password) {
//         res.json({
//             code: 400,
//             message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ!"
//         });
//         return;
//     }

//     await User.updateOne({
//         token : token 
//     },{
//         password : md5(password) ,
//     })
    
//     res.json({
//         code: 200,
//         message : "Đổi mật khẩu thành công" ,
//     });

// };


// // [GET]/api/v1/users/list
// export const list = async (req : Request ,res : Response) => {
//     const users = await User.find({deleted:false}).select("id fullName email")

//     res.json({
//         code: 200,
//         message : "Thành công" ,
//         users :  users
//     });

// };