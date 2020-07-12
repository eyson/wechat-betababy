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
    const d = new Date();
    const result = {
        errCode: 0,
        errMsg: 'ok',
        data: {}
    };

    // 插入一条宝宝与用户的关联信息
    let data = {
        babyId: event.babyId,
        openid: wxContext.OPENID,
        rules: {
            r: 1,
            w: 1,
            d: 1
        }, // 权限 r-读,w-写,d-删
        type: 0, // 0-关联，1-创建
        userInfo: event.userInfo,
        createTime: d.getTime(),
        modifyTime: d.getTime()
    };

    // 写入关联信息
    let ret = await db.collection('relationship').add({
        data: data
    });

    console.log(ret);

    result.data['relationshipId'] = ret._id;

    return result;

}