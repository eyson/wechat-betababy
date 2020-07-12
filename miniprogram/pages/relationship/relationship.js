/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        babyId: null,
        babyInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置页面标题
        wx.setNavigationBarTitle({
            title: "关联宝宝"
        });

        // 从URL中获取参数
        this.setData({
            babyId: options.babyId ? options.babyId : null
        });

        console.log(options);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getBabyDetail();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },

    /**
     * 查询关联信息
     */
    getBabyDetail: function () {
        wx.showLoading({
            title: '查询中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'getBabyDetail',
            data: {
                babyId: this.data.babyId
            }
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if (res.result.errCode === 0) {
                // 成功
                this.setData({
                    isShow: true,
                    babyInfo: res.result.data
                });
            } else {
                this.setData({
                    isShow: false,
                    babyInfo: {}
                });
                // 失败，提示信息
                wx.showToast({
                    title: '系统异常，请重试',
                    icon: 'none'
                });
            }
        }).catch(err => {
            // 执行失败
            // err.errCode,err.errMsg
            console.log(err.errCode, err.errMsg);
            this.setData({
                isShow: false,
                babyInfo: {}
            });
            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    },

    /**
     * 确认关联
     */
    confirmRelation: function () {
        wx.showLoading({
            title: '关联中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'confirmRelation',
            data: {
                babyId: this.data.babyId,
                userInfo: app.globalData.$userInfo
            }
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if (res.result.errCode === 0) {
                // 成功，回到列表
                wx.navigateTo({
                    url: `/pages/baby/detail/detail?babyId=${this.data.babyId}`,
                });
            } else {
                // 失败，提示信息
                wx.showToast({
                    title: '系统异常，请重试',
                    icon: 'none'
                });
            }
        }).catch(err => {
            // 执行失败
            // err.errCode,err.errMsg
            console.log(err.errCode, err.errMsg);

            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    },

    /**
     * 解除关联
     */
    removeRelation: function(){
        const babyInfo = this.data.babyInfo;
        wx.showLoading({
            title: '解除中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'removeRelation',
            data: {
                babyId: this.data.babyId,
                type: babyInfo.rel.type
            }
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if (res.result.errCode === 0) {
                // 成功，刷新页面
                this.getBabyDetail();
            } else {
                // 失败，提示信息
                wx.showToast({
                    title: '系统异常，请重试',
                    icon: 'none'
                });
            }
        }).catch(err => {
            // 执行失败
            // err.errCode,err.errMsg
            console.log(err.errCode, err.errMsg);

            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    }
})