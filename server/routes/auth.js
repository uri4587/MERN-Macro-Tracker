const User = require('../models/User');

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//POST Route: '/signup'
//Description: Signs user up for account
//PRIVATE
router.post('/signup', async (req, res) => {
    const user = req.body;

    const takenEmail = await User.findOne({ email: user.email});

    if(takenEmail) {
        res.json({message: "Email has already been taken"})
    } else {
        await bcrypt.hash(user.password, 8)
            .then( hashedPassword => {
                const dbUser = new User({ 
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: hashedPassword
                })
        
                dbUser.save()
                    .then(user => {
                        res.json({message: "Saved Successfully"})
                    })
                    .catch(err => {
                        res.json({message: err.message})
                    })
            })
        .catch(err => {
            // console.log(err)
            res.json("Password Required")
        })
        
    }
})

// POST Route: '/signin'
// Signs in user
router.post('/signin', (req, res) => {
    const userLoggingIn = req.body;

    if(!userLoggingIn.email || !userLoggingIn.password) {
        return res.status(422).json({error: 'Please provide email and password'})
    };

    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
        if(!dbUser) {
            return res.json({
                message: "Invalid Email or Password"
            })
        }
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
            if(isCorrect) {
                const payload = {
                    id: dbUser._id,
                    email: dbUser.email,
                }
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    (err, token) => {
                        if(err) return res.json({message: err})
                        return res.json({
                            message: "Success",
                            token: "Bearer" + token
                        })
                    }
                )
            } else {
                return res.json({
                    message: "Invalid Email or Password"
                })
            }
        })
    })
})

function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"]?.split('')[1]

    if(token) {
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if(err) return res.json({
                isLoggedIn: false, 
                message: "Failed To Authenticate"
            })
            req.user = {};
            req.user.id = decoded.id;
            req.user.email = decoded.email;
            next()
        })
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}

//GET logged In User 
router.get('/getUsername', verifyJWT, (req, res) => {
    res.json({isLoggedIn: true, email: req.user.email})
})

module.exports = router;