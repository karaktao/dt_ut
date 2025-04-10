// server/index.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

// 允许跨域访问本后端
app.use(cors());

// [示例API] /api/ships 用来代理外部的EURIS接口
app.get('/api/ships', async (req, res) => {
    try {
        // ★ 这里是你要访问的外部 API
        const eurisUrl = 'https://www.eurisportal.eu/visuris/api/TracksV2/GetTracksByBBoxV2?minLon=6.0&minLat=51.08&maxLon=9.0&maxLat=53.42';

        const response = await fetch(eurisUrl);   // Node端fetch
        const data = await response.json();

        // 将拿到的数据原样返回给前端
        res.json(data);
    } catch (error) {
        console.error('代理 EURIS 失败:', error);
        res.status(500).json({ error: '获取远程数据失败' });
    }
});

app.listen(PORT, () => {
    console.log(`后端服务器已启动: http://localhost:${PORT}`);
});
