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
    const result = {
        errCode: 0,
        errMsg: 'ok',
        type: 0,
        data: {}
    };

    // 查询宝宝是否有关联
    let ret = await db.collection('posts').where({
        _id: _.eq(event.postId)
    }).get();

    console.log(ret);
    if(ret.data.length > 0){
        result.data = ret.data[0];
        // 0-不是我的，1-是我的
        result.type = wxContext.OPENID === ret.data[0].openid ? 1 : 0;
    }

    return result;

}