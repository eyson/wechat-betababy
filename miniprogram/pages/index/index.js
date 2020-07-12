/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * 首页
 * 展示宝宝及记录
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

// 获取app实例
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 分页
        offset: 0,
        // 是否加载更多
        isLoadmore: false,
        // 当前选择的宝宝
        babyInfo: {},
        // 记录列表
        postList: [],
        // 配置信息
        postConfig: {},
        // 是否完成查询
        isShow: false,
        // 动态计算滚动列表高度，以便做自适应
        scrollViewHeight: 0,
        // 当前默认选择的宝宝
        pickerBabyIndex: 0,
        // 查询回来的宝宝数据
        pickerBabyList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // 计算页面高度
        wx.getSystemInfo({
            complete: (res) => {
                this.setData({
                    scrollViewHeight: res.windowHeight - 90
                });
            },
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // console.log(app.globalData);
        // 重新拉取数据
        this.setData({
            offset: 0,
            isLoadmore: false
        });

        wx.showLoading({
            title: '查询中...',
        });
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
     * 用户点击切换宝宝
     * 
     * @author Eyson You
     */
    selectBaby: function (e) {
        console.log('下标是：', e.detail.value);
        this.setData({
            pickerBabyIndex: e.detail.value,
            babyInfo: this.data.pickerBabyList[e.detail.value]
        });

        wx.showLoading({
          title: '查询中...',
        });
        // 切换数据
        this.getPosts();
    },

    /**
     * 获取当前选择的宝宝
     */
    getBabyInfo: function(){
        const baby = this.data.pickerBabyList[this.data.pickerBabyIndex] || {};
        return baby;
    },

    /**
     * 向上滚动到头
     * 
     * @author Eyson You
     */
    scrolltoupper: function () {
        console.log('scrolltoupper');
    },

    /**
     * 向下滚动到尾
     * 
     * @author Eyson You
     */
    scrolltolower: function () {
        // 加载更多
        if(this.data.isLoadmore){
            console.log('scrolltolower');
            this.setData({
                offset: this.data.offset + 1
            });

            wx.showLoading({
                title: '查询中...',
            });
            this.getPosts();
        }
    },

    /**
     * 滚动时
     * 
     * @author Eyson You
     */
    scrolling: function () {
        // console.log('scrolling');
    },

    /**
     * 获取宝宝列表
     */
    getBabies: function () {
        // wx.showLoading({
        //     title: '查询中...',
        // });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'getBabies'
        }).then(res => {
            // 执行成功
            console.log(res);
            let result = res.result;
            // wx.hideLoading();

            this.setData({
                isShow: true
            });

            if (result.errCode === 0) {
                // 成功，返回上页
                if(result.data.length > 0){
                    this.setData({
                        pickerBabyList: result.data,
                        babyInfo: result.data[this.data.pickerBabyIndex]
                    });

                    // 查询记录
                    this.getPosts();
                }else{
                    wx.hideLoading();
                }
            } else {
                this.setData({
                    pickerBabyList: []
                });
                // 失败，提示信息
                wx.showToast({
                    title: '系统异常，请重试',
                    icon: 'none'
                });
            }

            // console.log(this.data.pickerBabyList);
        }).catch(err => {
            // 执行失败
            // err.errCode,err.errMsg
            console.log(err.errCode, err.errMsg);
            this.setData({
                isShow: true,
                pickerBabyList: []
            });
            // wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    },

    /**
     * 记录列表
     */
    getPosts: function(){
        // wx.showLoading({
        //     title: '查询中...',
        // });
        // 请求云函数
        wx.cloud.callFunction({
            name: 'getPosts',
            data: {
                babyId: this.data.babyInfo._id,
                offset: this.data.offset
            }
        }).then(res => {
            // 执行成功
            console.log(res);
            let result = res.result;
            wx.hideLoading();

            if (result.errCode === 0) {
                let postList = this.data.offset > 0 ? this.data.postList.concat(result.data) : result.data;
                // 成功，返回上页
                this.setData({
                    postList: postList,
                    offset: result.offset,
                    isLoadmore: result.data.length >= result.limit
                });
            } else {
                this.setData({
                    postList: [],
                    offset: 0,
                    isLoadmore: false
                });
                // 失败，提示信息
                wx.showToast({
                    title: '系统异常，请重试',
                    icon: 'none'
                });
            }

            // console.log(this.data.pickerBabyList);
        }).catch(err => {
            // 执行失败
            // err.errCode,err.errMsg
            console.log(err.errCode, err.errMsg);
            this.setData({
                postList: [],
                offset: 0,
                isLoadmore: false
            });
            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    }
})