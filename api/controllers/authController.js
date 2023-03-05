const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(404).json("user not found");
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).json("wrong password")
        const accessToken = jwt.sign({user: user}, process.env.JWT_SECRET, {expiresIn: '2m'});
        const refreshToken = jwt.sign({user: user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5m'});
        //assign refresh token in http-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.json({accessToken});

    } catch (err) {
        return res.status(500).json(err)
    }
}
//register
exports.register = async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
}
//refresh token
exports.refreshToken = async (req, res) => {
    try {
        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
                if (err) {
                    // Wrong Refesh Token
                    return res.status(406).json({message: 'Unauthorized'});
                } else {
                    // Correct token we send a new access token
                    const accessToken = jwt.sign({
                        user: decode.user
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '10m'
                    });
                    const refreshTokenGenerat = jwt.sign(decode.user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'});
                    res.cookie('refreshToken', refreshTokenGenerat, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000
                    });
                    return res.json({accessToken});
                }
            });
        } else {
            return res.status(406).json({message: 'Unauthorized'});
        }
    } catch (error) {
        res.status(500).send({
            error
        })
    }
}
