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
        babyId: event.babyId,
        data: {}
    };

    // 修改宝宝记录-babies
    let params = {
        name: event.name,
        sex: event.sex,
        birthday: event.birthday,
        height: event.height,
        weight: event.weight,
        fileId: event.fileId,
        // status: 0,
        userInfo: event.userInfo,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        // createTime: d.getTime(),
        modifyTime: d.getTime()
    };

    // 删除关联
    let ret = await db.collection('babies').where({
        _id: _.eq(event.babyId),
        openid: wxContext.OPENID
    }).update({
        data: params
    });

    console.log(ret);

    // 修改是否成功
    if (ret.stats.updated != 1) {
        result.errCode = 1;
        result.errMsg = '修改失败，请重试'
    } else {
        // 记录身高流水
        if(event.isHeightLogs){
            cloud.callFunction({
                name: 'addLogs',
                data: {
                    babyId: event.babyId,
                    field: 'height',
                    content: event.height,
                    userInfo: event.userInfo
                }
            });
        }

        // 记录体重流水
        if(event.isWeightLogs){
            cloud.callFunction({
                name: 'addLogs',
                data: {
                    babyId: event.babyId,
                    field: 'weight',
                    content: event.weight,
                    userInfo: event.userInfo
                }
            });
        }
    }

    return result;

}