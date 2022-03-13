const express = require("express");
const router = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));
    // this means '/api/users/test'

router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({ handle: req.body.handle }).then(user => {
        if (user) {
        errors.handle = "User already exists";
        return res.status(400).json(errors);
            // return res.status(400).json({handle: 'user already exists'}) 
        } else {
        const newUser = new User({
            handle: req.body.handle,
            email: req.body.email,
            password: req.body.password
        });
    
        // newUser.save().then(user => res.send(user)).catch(err => res.send(err))

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
            })
        })
    }
})
})

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email})
    .then(user => {
        if (!user) {
            errors.email = 'user not found'
            return res.status(404).json(errors)
        }
        
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
                    const payload = {
                        id: user.id,
                        handle: user.handle,
                        email: user.email
                    }
                    jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                        res.json({
                            succes: true,
                            token: 'Bearer' + token
                        })
                    })
                    // res.json({msg: 'success'})
                } else {
                    return res.status(400).json({ password: 'password is incorrect'})
                }
            })
    })

});

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
      id: req.user.id,
      handle: req.user.handle,
      email: req.user.email
    });
  })

module.exports = router;