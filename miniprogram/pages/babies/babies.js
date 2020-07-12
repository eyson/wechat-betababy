/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 最大限制
        isLimit: false,
        // 显示页面
        isShow: false,
        babyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置页面标题
        wx.setNavigationBarTitle({
            title: "宝宝"
        });
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
        this.getBabies();
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
     * 获取宝宝列表
     */
    getBabies: function () {
        wx.showLoading({
            title: '查询中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'getBabies'
        }).then(res => {
            // 执行成功
            console.log(res);
            let result = res.result;
            wx.hideLoading();

            if (result.errCode === 0) {
                // 成功，返回上页
                this.setData({
                    isShow: true,
                    isLimit: result.isLimit,
                    babyList: result.data
                });
            } else {
                this.setData({
                    isLimit: false,
                    isShow: false,
                    babyList: []
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
                isLimit: false,
                isShow: false,
                babyList: []
            });
            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    }
})