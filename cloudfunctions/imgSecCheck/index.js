/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
});

// 初始化数据库连接
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    // 从云存储下载文件
    const ret = await cloud.downloadFile({
        fileID: event.fileId
    });

    const buffer = ret.fileContent;
    console.log(event);
    const result = await cloud.openapi.security.imgSecCheck({
        media: {
            contentType: event.contentType,
            value: buffer
        }
    }).then(res => {
        return res;
    }).catch(err => {
        return err;
    });

    return result;


}