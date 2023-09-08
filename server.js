const express = require('express');
const app = express();
const PORT = 3000;

// 이미 tiles 폴더가 있으므로, 해당 폴더의 static files를 제공하기 위한 설정
app.use('/tiles', express.static('tiles'));

app.get('/', (req, res) => {
    res.send("BDO Map Server is Running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
