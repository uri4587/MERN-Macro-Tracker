const User = require('../models/User');

const router = require('express').Router();
const bcrypt = require('bcryptjs');

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

module.exports = router;