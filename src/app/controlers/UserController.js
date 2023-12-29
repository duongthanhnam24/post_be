const User = require("../models/userDataBase");
const { accesToken, refreshToken } = require("../../config/service/accesToken");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
    try {
        const { name, userName, password, role } = req.body;

        if (!name || !userName || !password || !role) {
            return res.status(400).json({ message: "Bạn quên điền gì đó" });
        }
        const checkUserName = await User.findOne({ userName: userName });
        if (checkUserName) {
            return res.status(400).json({ message: "Tên tài khoản đã tồn tại" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const createUser = await new User({
            name,
            userName,
            role,
            password: hash,
        });
        const user = await createUser.save();
        return res.status(200).json({ user, message: "Tạo tài khoản thành công" });
    } catch (e) {
        return res.status(400).json({ message: e });
    }
};

const SignIn = async (req, res) => {
    try {
        const getUser = await User.findOne({ userName: req.body.userName });

        if (!getUser) {
            return res.status(400).json({ message: "user name not found" });
        }

        const checkPassword = await bcrypt.compareSync(req.body.password, getUser.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Sai Mật khẩu" });
        }

        if (getUser && checkPassword) {
            const accToken = await accesToken({
                id: getUser._id,
                isAdmin: getUser.isAdmin,
            });
            const refreshTok = await refreshToken({
                id: getUser._id,
                isAdmin: getUser.isAdmin,
            });

            const { password, checkpassword, ...others } = getUser._doc;
            return res.status(200).json({ ...others, accToken, refreshTok });
        }
    } catch (e) {
        return res.status(400).json({ message: e });
    }
};

const GetAllUser = async (req, res) => {
    try {
        const allUser = await User.find();
        return res.status(200).json(allUser);
    } catch (error) {
        return res.status(400).json({ message: "Không tìm thấy tài khoản nào" });
    }
};
const getUser = async (req, res) => {
    try {
        const human = await User.findOne({ _id: req.params.id });
        console.log(human);
        return res.status(200).json(human);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
module.exports = {
    createUser,
    SignIn,
    GetAllUser,
    getUser,
};
