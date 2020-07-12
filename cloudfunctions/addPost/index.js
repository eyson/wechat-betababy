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

    try {

        // 检查敏感内容
        if (event.memo) {
            let ret = await cloud.openapi.security.msgSecCheck({
                content: event.memo
            });

            // 内容检查不通过，返回一个 promise 错误对象
            if (ret.errCode !== 0) {
                return new Promise((resolve, reject) => {
                    reject(ret);
                });
            }
        }

        // 多数据库操作，使用事务
        const result = await db.runTransaction(async transaction => {
            // 插入记录-posts
            let params = {
                babyId: event.babyId,
                eventType: event.eventType,
                eventTypeDesc: event.eventTypeDesc,
                postType: event.postType,
                postTypeDesc: event.postTypeDesc,
                quantity: event.quantity,
                unit: event.unit,
                postDateTime: `${event.postDate} ${event.postTime}:00`,
                postDate: event.postDate,
                postTime: event.postTime,
                userInfo: event.userInfo,
                icon: event.icon,
                memo: event.memo,
                openid: wxContext.OPENID,
                // appid: wxContext.APPID,
                // unionid: wxContext.UNIONID,
                createTime: d.getTime(),
                modifyTime: d.getTime()
            };

            // 服务端返回数据格式 {errorCode: 0, errorMessage: 'ok'}
            // 服务成功 {"_id":"05f2c36f5eaea1370000369d5eb92f27","errMsg":"collection.add:ok"}
            // 客户端返回数据格式 {errMsg: 'ok', result: {_id: 'xx'}, requestID: 'xxxx'}
            let posts = await transaction.collection('posts').add({
                data: params
            });

            console.log(posts);

            // 写入数据失败，回滚数据
            if (!posts._id) {
                return await transaction.rollback(-100);
            }

            // 返回给客户端的数据格式-自定义
            return {
                errCode: 0,
                errMsg: 'ok',
                postId: posts._id
            };
        });

        // console.log(result);
        return result;

    } catch (err) {
        return err;
    }

}