/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

 import { dateUtils } from '../../../utils/date-utils';

 Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        // 0-不可删除,1-可以删除
        type: 0,
        postId: null,
        postInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置页面标题
        wx.setNavigationBarTitle({
            title: "记录详情"
        });

        // 保存参数
        this.setData({
            postId: options.postId ? options.postId : null
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
        this.getPost();
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
     * 查询记录详情
     */
    getPost: function(){
        wx.showLoading({
            title: '查询中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'getPost',
            data: {
                postId: this.data.postId
            }
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if (res.result.errCode === 0) {
                // 成功
                let postInfo = res.result.data;
                postInfo.createTime = dateUtils.getDateTime(postInfo.createTime);
                postInfo.modifyTime = dateUtils.getDateTime(postInfo.modifyTime);
                this.setData({
                    isShow: true,
                    type: res.result.type,
                    postInfo: postInfo
                })
            } else {
                this.setData({
                    isShow: false,
                    type: 0,
                    postInfo: {}
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
                type: 0,
                postInfo: {}
            });
            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    },

    /**
     * 删除记录
     * 
     * eysonyou
     */
    removePost: function() {
        wx.showLoading({
            title: '删除中...',
        });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'removePost',
            data: {
                postId: this.data.postId
            }
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if (res.result.errCode === 0) {
                // 成功，回到列表
                wx.navigateBack();
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