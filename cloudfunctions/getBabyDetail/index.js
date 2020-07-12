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
        data: {}
    };

    // 查询宝宝详情
    let baby = await db.collection('babies').where({
        // openid: wxContext.OPENID,
        _id: _.eq(event.babyId)
    }).get();

    console.log(baby);

    result.data['detail'] = baby.data[0];

    // 查询关联信息
    let ret = await db.collection('relationship').where({
        openid: wxContext.OPENID,
        babyId: event.babyId
    }).get();

    console.log(ret);
    if(ret.data.length > 0){
        result.data['rel'] = ret.data[0];
    }else{
        result.data['rel'] = {};
    }
    
    return result;

}