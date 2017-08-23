const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.text());

/**
 * 日志级别对应的颜色枚举
 */
const levelColorEnum = {
    info: [32, 39],
    warn: [33, 39],
    error: [31, 39],
};

/**
 * 获取日志颜色
 * 
 * @param {string} level - 日志级别
 */
const colorize = level => {
    const color = levelColorEnum[level];
    return {
        start: `\x1B[${color[0]}m`,
        end: `\x1B[${color[1]}m`,
    };
};

/**
 * 允许跨域
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/**
 * 接收日志的接口
 */
app.use('/log', (req, res) => {
    let logs = req.body;

    // 如果logs是字符串，说明来自 sendBeacon
    if (typeof logs === 'string') {
        try {
            logs = JSON.parse(logs);
        } catch (err) {
            logs = null;
        }
    }

    // 如果日志是一个数组，说明是正常的数据
    if (Array.isArray(logs)) {
        logs.forEach(log => {
            const time = log.time;
            const level = log.level;
            const msg = log.messages;
            const url = log.url;
            const agent = log.agent;
            const color = colorize(level);
            console[level](`${color.start}[${time}] [${level.toUpperCase()}] [${url}] -${color.end}`, ...msg, `用户代理: ${agent}`);
        });
    }

    // 仅返回一个空字符串，节省带宽
    res.end('');
});

app.listen(2017);
console.info('日志服务器已启动：http://127.0.0.1:2017/log');
