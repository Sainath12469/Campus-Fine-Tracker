const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No Token Provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, "secret");

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Invalid Token"
        });

    }

};

module.exports = verifyToken;