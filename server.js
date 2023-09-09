const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8389;

// 정적 파일(타일 이미지)을 제공하기 위한 디렉토리 설정
const tilesDirectory = path.join(__dirname, 'tiles');
const fallbackTile = path.join(tilesDirectory, '6/0/0.png'); // 대체 이미지 경로

app.use(cors());

// 타일 이미지 라우터 설정
app.get('/tiles/:z/:x/:y.png', (req, res) => {
    const { z, x, y } = req.params;
    const tilePath = path.join(tilesDirectory, z, x, `${y}.png`);

    // 타일 이미지 응답
    res.sendFile(tilePath, (err) => {
        if (err) {
            // 타일 이미지가 없을 경우 대체 이미지를 응답으로 전송
            res.sendFile(fallbackTile, (fallbackErr) => {
                if (fallbackErr) {
                    res.status(404).send('Tile and fallback not found');
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
