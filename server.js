require('dotenv').config();

// 필요한 모듈들을 임포트
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');  // 추가

const app = express();
const PORT = 8389;

// MongoDB 연결을 위한 URI를 환경 변수에서 가져옴
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB에 연결
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB 연결이 성공하면 메시지 출력
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// MongoDB 연결에 실패하면 에러 메시지 출력
mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB', err);
});

// 타일 이미지 경로 설정
const tilesDirectory = path.join(__dirname, 'tiles');
const fallbackTile = path.join(tilesDirectory, '6/0/0.png');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

// CORS 및 JSON 파싱 미들웨어 추가
// app.use(cors({
//   origin: 'http://localhost:3000', // 리액트 애플리케이션의 주소
//   credentials: true,
//   optionsSuccessStatus: 200,
// }));

app.use(cors(corsOptions));

app.use(express.json());


// 인증 토큰 확인 로직
app.get('/api/auth/status', (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];  // "Bearer YOUR_JWT" 형식으로 오는 것을 고려

  console.log('token = ' + token);
  console.log('status');

  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false, message: 'Failed to authenticate token' });
    }
    console.log("success token");
    // 토큰이 유효한 경우
    res.json({
      isAuthenticated: true,
      username: decoded.username,
      role: decoded.role
    });
  });
});

// API 라우터들을 임포트
const userRoutes = require('./routes/userRoutes');
const npcRoutes = require('./routes/npcRoutes');
const markerRoutes = require('./routes/markerRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminMarkerRoutes = require('./routes/adminMarkerRoutes');

// API 라우터들을 Express 앱에 연결
app.use('/api/users', userRoutes);
app.use('/api/npcs', npcRoutes);
app.use('/api/markers', markerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/adminMarkers', adminMarkerRoutes);

// Passport 미들웨어 초기화 및 설정 적용
app.use(passport.initialize());
require('./config/passport')(passport);


// 타일 이미지 라우터 설정
app.get('/tiles/:z/:x/:y.png', (req, res) => {
    const { z, x, y } = req.params;
    const tilePath = path.join(tilesDirectory, z, x, `${y}.png`);

    // 요청받은 타일 이미지 응답
    res.sendFile(tilePath, (err) => {
        if (err) {
            // 해당 타일 이미지가 없을 경우 대체 이미지 응답
            res.sendFile(fallbackTile, (fallbackErr) => {
                if (fallbackErr) {
                    res.status(404).send('Tile and fallback not found');
                }
            });
        }
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
