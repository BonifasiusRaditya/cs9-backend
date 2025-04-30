const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse");
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const saltRounds = 10;

exports.RegisterAccount = async (req, res) => {
    if(!emailRegex.test(req.query.email)){
        return baseResponse(res, false, 500, "Invalid Email", null);
    }
    if(!passwordRegex.test(req.query.password)){
        return baseResponse(res, false, 500, "Invalid Password", null);
    }
    if (!req.query.email || !req.query.password || !req.query.name) {
        return baseResponse(res, false, 400, "Missing email, password, or name", null);
    }
    try {
        const hashedPassword = await bcrypt.hash(req.query.password, saltRounds);
        const user = await userRepository.RegisterAccount({
            name: req.query.name, 
            email: req.query.email, 
            password: hashedPassword
        });
        baseResponse(res, true, 201, "User created", user);
    } catch (error) {
        baseResponse(res, false, 500, "Email Already in Used" || "Server error", error);
    }
};

exports.loginAccount = async (req, res) => {
    if (!req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, "Missing email or password", null);
    }
    try {
        const user = await userRepository.loginAccount(req.query.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const match = await bcrypt.compare(req.query.password, user.password);
        if (match) {
            baseResponse(res, true, 200, "User logged in", user);
        } else {
            baseResponse(res, false, 401, "Invalid email or password", null);
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getEmailbyid = async (req, res) => {
    try {
        const user = await userRepository.getEmailbyid(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "User Not Found", error);
    }
};

exports.updateUser = async (req, res) => {
    if(!emailRegex.test(req.body.email)){
        return baseResponse(res, false, 500, "Invalid Email", error);
    }
    if(!passwordRegex.test(req.body.password)){
        return baseResponse(res, false, 500, "Invalid Password", null);
    }
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.id) {
        return baseResponse(res, false, 400, "Missing user email, password, name, or id", null);
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = await userRepository.updateUser({
            id: req.body.id,
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        });
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User updated", user);
    } catch (error) {
        baseResponse(res, false, 500, "User Not Found", error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await userRepository.deleteUser(req.params.id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted", user);
    } catch (error) {
        baseResponse(res, false, 500, "User Not Found", error);
    }
};

exports.topUp = async (req, res) => {
    if (!req.query.id || !req.query.balance) {
        return baseResponse(res, false, 400, "Missing id or balance", null);
    }
    if(req.query.balance <= 0){
        return baseResponse(res, false, 500, "Balance must be higher than 0", null);
    }
    try {
        const user = await userRepository.topUp({
            id: req.query.id,
            balance: req.query.balance
        });
        if (!user) {
            return baseResponse(res, false, 404, "not found", null);
        }
        baseResponse(res, true, 200, "User topped up", user);
    } catch (error) {
        baseResponse(res, false, 500, "Internal Server Error", error);
    }
};
