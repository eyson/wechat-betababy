/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'release',
                env: 'test',
                traceUser: true,
            })
        }

        // 保存全局数据
        this.globalData = {
            $loginUrl: '/pages/login/login',
            $userInfo: null
        }

        // 查询授权
        wx.getSetting({
            success: (res) => {
                // 查询成功
                let auth = res.authSetting;
                // console.log(auth);
                if (auth['scope.userInfo']) {
                    // 已授权
                    this.globalData.$isLogin = true;
                    // 查用户
                    wx.getUserInfo({
                        lang: 'zh_CN',
                        success: (o) => {
                            this.globalData.$userInfo = o.userInfo
                        }
                    });
                } else {
                    // 无授权
                    this.globalData.$isLogin = false;
                    // 去登录
                    wx.navigateTo({
                        url: this.globalData.$loginUrl
                    });
                }
            },
            fail: (res) => {
                // 执行失败
                wx.showToast({
                    title: '系统繁忙，请稍后再试'
                })
            },
            complete: (res) => {
                // 执行完成
                console.log('Launch done! Get setting complete.');
            }
        });

    }
})