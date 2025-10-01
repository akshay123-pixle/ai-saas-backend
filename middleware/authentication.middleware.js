import jwt from "jsonwebtoken";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

export const protect = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. No token. Please login to proceed" });
    }

    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        req.user = decoded; // attach userId to req.user
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token expired or invalid." });
    }
};
