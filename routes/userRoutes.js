const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// Create
router.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(user);
    });
});


// Read All
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Read By ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update
  router.put('/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user == null) return res.status(404).json({ message: 'Cannot find User' });
      res.json({ message: 'Deleted the User' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Sign Up
  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // 아이디와 비밀번호 입력 확인
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // 중복 아이디 체크
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // 새로운 사용자 생성
        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });

  //login
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. 사용자 입력값 검증
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // 2. 데이터베이스에서 사용자 조회
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 3. 비밀번호 확인
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        // 4. 토큰 생성
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // // 5. 토큰 응답
        // return res.json({
        //     token: `Bearer ${token}`,
        //     user: payload
        // });

        // 5. 토큰 쿠키로 저장
        res.cookie('auth_token', `Bearer ${token}`, { httpOnly: false, secure: true });
        return res.status(200).json({ user: payload });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

  router.get('/google/login', passport.authenticate('google', { scope: ['profile'] }));

  // Google Login Callback
  router.get('/google/callback', 
      passport.authenticate('google', { failureRedirect: '/login', session: false }), // 로그인 실패 시 리다이렉션 변경
      async (req, res) => {
          // 인증에 성공하면 req.user에 사용자 정보가 저장됩니다.
          const user = req.user;
          const payload = {
              id: user.id,
              username: user.username,
              // other fields based on your User schema
          };
          const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: '1h'
          });

          // 클라이언트에 직접 토큰을 보내주지 않고, 클라이언트 측에 토큰을 저장하는 방식 변경 (예: 쿠키, 세션)
          res.cookie('auth_token', `Bearer ${jwtToken}`, { httpOnly: false, secure: true }); // 토큰을 쿠키로 저장
          res.redirect('http://localhost:3000/'); // or your desired route
      }
);

module.exports = router;
