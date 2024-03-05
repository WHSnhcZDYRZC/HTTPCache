const express = require("express");
const app = express();
const CryptoJS = require('crypto-js/crypto-js');
const fs = require('fs');

const strongCache = {
    etag: false, // 禁用协商缓存
    lastModified: false, // 禁用协商缓存
    setHeaders: (res, path, stat) => {
        console.log("执行！");
        res.set('Cache-Control', 'max-age=10'); // 强缓存超时时间为10秒
    },
}

const negotiateCache = {
    etag: true, // 开启协商缓存
    lastModified: true, // 开启协商缓存
    setHeaders: (res, path, stat) => {
        res.set({
            'Cache-Control': 'max-age=00', // 浏览器不走强缓存
            'Pragma': 'no-cache', // 浏览器不走强缓存
        });
    }
};

const strongEtagCache = { 
    etag: true, // 只通过Etag来判断
    lastModified: false, // 关闭另一种协商缓存
    setHeaders: (res, path, stat) => {
      const data = fs.readFileSync(path, 'utf-8'); // 读取文件
      const hash = CryptoJS.MD5((JSON.stringify(data))); // MD5加密
      res.set({
        'Cache-Control': 'max-age=00', // 浏览器不走强缓存
        'Pragma': 'no-cache', // 浏览器不走强缓存
        'ETag': hash, // 手动设置Etag值为MD5加密后的hash值
      });
    },
  };

app.use(express.static(__dirname + "/public", negotiateCache));

app.listen(3001, () => {
    // console.log("客户端启动完成～");
    console.log("http://localhost:3001");
})