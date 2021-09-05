const jwt = require("jsonwebtoken");
require("dotenv")
module.exports = function (req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.split('Bearer ')[1] : null;
    if (!token) return res.status(401).json({
        success: false,
        message: "Auth Error",
    });
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_PASSPHRASE);
        req.user = decoded.user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Invalid Token",
        });
    }
};