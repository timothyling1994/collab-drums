const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./models/user');
//const Admin = require('./models/admin');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
//this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        
       
        User.findOne({email}).lean(true).then(user => {

            if(user)
            {
                bcrypt.compare(password,user.password,(err,res)=>{
                    if(res){
                        console.log("User password MATCHED");
                        return cb(null, user, {message: 'Logged In Successfully'});
                    }
                    else
                    {
                        console.log("User password NO MATCH");
                        return cb(null, false, {message: 'Incorrect email or password.'});
                    }
                })
            }
       }).catch(err => cb(err));; 
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findById(jwtPayload._id)
            .then(user => {
                console.log("jwtPayload");
                console.log(jwtPayload);
                return cb(null, user);
            })
            .catch(err => {
                console.log("error");
                return cb(err);
            });
    }
));