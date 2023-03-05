const jwt = require('jsonwebtoken');
//verify
exports.verifyAccessToken = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) return res.status(401).json({message: "No token provided!"});
    const accessToken = authToken.split(' ')[1];
    if (!accessToken) return res.status(401).json({message: "No token provided"});
    try {
        const user = await jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({error: 'Unauthorized'})
    }

}