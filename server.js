const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 정적 파일(타일 이미지)을 제공하기 위한 디렉토리 설정
const tilesDirectory = path.join(__dirname, 'tiles');

// 타일 이미지 라우터 설정
app.get('/tiles/:z/:x/:y.png', (req, res) => {
    const { z, x, y } = req.params;
    const tilePath = path.join(tilesDirectory, z, x, `${y}.png`);

    // 타일 이미지 응답
    res.sendFile(tilePath, (err) => {
        if (err) {
            res.status(404).send('Tile not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
