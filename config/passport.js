const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
require('dotenv').config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.error(err));
        })
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT,
                clientSecret: process.env.GOOGLE_PWD,
                callbackURL: 'http://localhost:8389/api/users/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const existingUser = await User.findOne({ googleId: profile.id });
                    if (existingUser) return done(null, existingUser);

                    const newUser = new User({
                        googleId: profile.id,
                        username: profile.displayName // or other field based on your User schema
                    });
                    await newUser.save();
                    done(null, newUser);
                } catch (err) {
                    done(err, false, err.message);
                }
            }
        )
    );
};
