/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

// 获取APP实例
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置页面标题
        wx.setNavigationBarTitle({
            title: "登录"
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
     * 授权登录
     */
    bindGetUserInfo: function (e) {
        // console.log(e);
        let o = e.detail || {};
        let isLogin = o.userInfo ? true : false;

        // 更新全局信息
        app.globalData.$isLogin = isLogin;
        app.globalData.$userInfo = o.userInfo;

        if(isLogin){
            // 登录成功，返回上一页
            wx.navigateBack();
        }

    }
})