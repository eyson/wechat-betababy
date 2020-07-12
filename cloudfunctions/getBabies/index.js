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
    const result = {errCode: 0, errMsg: 'ok', isLimit: false, data: []};
    const MAX_LIMIT = 5;

    // 查询关联表，最多关联10
    let relationship = await db.collection('relationship').where({
        openid: wxContext.OPENID
    }).limit(MAX_LIMIT).orderBy('createTime', 'asc').get();

    console.log(relationship);
    let rows = relationship.data || [];
    let data = [];
    rows.forEach(row => {
        data.push(_.eq(row.babyId));
    });

    // 无数据
    if(data.length <= 0){
        return result;
    }

    // 根据关联表的信息查询宝宝列表
    let babies = await db.collection('babies').where({
        _id: _.or(data)
    }).limit(MAX_LIMIT).orderBy('createTime', 'asc').get();

    console.log(babies);
    result.data = babies.data || [];
    result.isLimit = result.data.length >= MAX_LIMIT;

    return result;

}