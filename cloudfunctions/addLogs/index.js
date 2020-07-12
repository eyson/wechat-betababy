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
    const d  = new Date();
    const result = {
        errCode: 0,
        errMsg: 'ok',
        logId: ''
    };

    // 添加记录流水-logs
    let params = {
        babyId: event.babyId,
        field: event.field,
        content: event.content,
        status: 1,
        userInfo: event.userInfo,
        openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        createTime: d.getTime(),
        modifyTime: d.getTime()
    };

    // 操作数据库
    let ret = await db.collection('logs').add({
        data: params
    });

    // 操作成功
    if(ret._id){
        result['logId'] = ret._id
    }

    console.log(ret);
    return result;

}