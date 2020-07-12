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
        // 多数据库操作，使用事务
        const result = await db.runTransaction(async transaction => {
            // 插入宝宝记录-babies
            let params = {
                name: event.name,
                sex: event.sex,
                birthday: event.birthday,
                height: event.height,
                weight: event.weight,
                fileId: event.fileId,
                status: 0,
                userInfo: event.userInfo,
                openid: wxContext.OPENID,
                // appid: wxContext.APPID,
                // unionid: wxContext.UNIONID,
                createTime: d.getTime(),
                modifyTime: d.getTime()
            };

            // 服务端返回数据格式 {errorCode: 0, errorMessage: 'ok'}
            // 服务成功 {"_id":"05f2c36f5eaea1370000369d5eb92f27","errMsg":"collection.add:ok"}
            // 客户端返回数据格式 {errMsg: 'ok', result: {_id: 'xx'}, requestID: 'xxxx'}
            let babies = await transaction.collection('babies').add({
                data: params
            });

            console.log(babies);

            // 写入数据失败，回滚数据
            if(!babies._id){
                return await transaction.rollback(-100);
            }

            // 插入一条宝宝与用户的关联信息
            let data = {
                babyId: babies._id,
                openid: wxContext.OPENID,
                rules: {
                    r: 1,
                    w: 1,
                    d: 1
                }, // 权限 r-读,w-写,d-删
                type: 1, // 0-关联，1-创建
                userInfo: event.userInfo,
                createTime: d.getTime(),
                modifyTime: d.getTime()
            };

            let relationship = await transaction.collection('relationship').add({
                data: data
            });

            console.log(relationship);

            // 写入数据失败，回滚数据
            if(!relationship._id){
                return await transaction.rollback(-100);
            }

            // 记录身高流水
            cloud.callFunction({
                name: 'addLogs',
                data: {
                    babyId: babies._id,
                    field: 'height',
                    content: event.height,
                    userInfo: event.userInfo
                }
            });

            // 记录体重流水
            cloud.callFunction({
                name: 'addLogs',
                data: {
                    babyId: babies._id,
                    field: 'weight',
                    content: event.weight,
                    userInfo: event.userInfo
                }
            });

            // 返回给客户端的数据格式-自定义
            return {errCode: 0, errMsg: 'ok', babyId: babies._id, relationshipId: relationship._id};
        });

        // console.log(result);
        return result;

    } catch (err) {
        return err;
    }

}