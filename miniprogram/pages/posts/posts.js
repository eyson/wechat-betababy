/**
 * Betababy v1.0
 * 2020-03-30
 * 
 * 添加/修改记录页
 * 添加和修改记录放在同一个页面
 * 通过 URL 带参数来控制逻辑
 * 
 * 添加
 * /pages/posts/posts
 * 
 * 修改
 * /pages/posts/posts?postId=1
 * 
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */

// 加载通用配置
import { postConfig } from '../../config/post-config';

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 记录宝宝ID
        babyId: null,
        // 记录ID 放库时转 _id
        postId: null,
        // 是否更新数据
        isUpdate: false,
        // 记录内容
        postTypePickerIndex: 0,
        postTypePickerList: postConfig.getPostTypeItems(10).items,
        // 记录分类
        eventTypePickerIndex: 0,
        eventTypePickerList: postConfig.postTypeConfig,
        // 发生时间
        datetimePickerIndex: [0, 9, 6],
        datetimePickerList: [postConfig.getDateList(), postConfig.getHourList(), postConfig.getMinuteList()]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取页面URL参数
        // console.log(options);
        const isUpdate = options.postId ? true : false; // 页面带参数为修改记录
        const title = isUpdate ? '修改记录' : '添加记录'; // 标题显示逻辑，修改功能暂不实现

        // 设置页面标题
        wx.setNavigationBarTitle({
            title: title
        });

        // 保存参数
        this.setData({
            postId: options.postId ? options.postId : null,
            babyId: options.babyId ? options.babyId : null
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
     * 选择记录分类
     */
    eventTypeSelect: function(e){
        console.log('记录分类', e.detail.value);
        const postItem = this.data.eventTypePickerList[e.detail.value];
        this.setData({
            eventTypePickerIndex: e.detail.value,
            // 变更后要二级联动处理，更新数据
            postTypePickerIndex: 0,
            postTypePickerList: postConfig.getPostTypeItems(postItem.id).items
        });
    },

    /**
     * 选择内容分类
     */
    postTypeSelect: function(e){
        console.log('内容分类', e.detail.value);
        this.setData({
            postTypePickerIndex: e.detail.value
        });
    },

    /**
     * 选择发生时间
     */
    postTimeSelect: function(e){
        console.log('发生时间', e.detail.value);
        this.setData({
            datetimePickerIndex: e.detail.value
        });
    },

    /**
     * 计算发生日期
     */
    getPostDate: function(){
        const data = this.data;
        const v = data.datetimePickerList[0][data.datetimePickerIndex[0]];
        // 2020-02-02
        return v
    },

    /**
     * 计算发生时间
     */
    getPostTime: function(){
        const data = this.data;
        const h = data.datetimePickerList[1][data.datetimePickerIndex[1]];
        const m = data.datetimePickerList[2][data.datetimePickerIndex[2]];
        // 23:22
        return `${h}:${m}`;
    },

    /**
     * 获取内容配置
     */
    getPostTypeItem: function(){
        const data = this.data;
        return data.postTypePickerList[data.postTypePickerIndex];
    },

    /**
     * 获取分类配置
     */
    getEventTypeItem: function(){
        const data = this.data;
        return data.eventTypePickerList[data.eventTypePickerIndex];
    },

    /**
     * 表单提交
     */
    bindSubmit: function(e){
        // 表单数据
        let data = e.detail ? e.detail.value : {};
        // 登录用户
        let userinfo = app.globalData.$userInfo;
        // 新增还是修改，修改功能保留，暂时不实现
        let fn = this.data.postId ? 'updatePost' : 'addPost';
        // 获取当前配置
        let eventTypeItem = this.getEventTypeItem();
        let postTypeItem = this.getPostTypeItem();

        // 构造请求参数
        data['eventType'] = eventTypeItem.id;
        data['eventTypeDesc'] = eventTypeItem.title,
        data['postType'] = postTypeItem.id;
        data['postTypeDesc'] = postTypeItem.title,
        data['postDate'] = this.getPostDate();
        data['postTime'] = this.getPostTime();
        data['unit'] = postTypeItem.unit;
        data['icon'] = eventTypeItem.icon,
        data['babyId'] = this.data.babyId;
        console.log(data);

        if(!data.quantity){
            wx.showToast({
              title: '请填写数据'
            })
            return;
        }

        // 用户数据
        data['userInfo'] = userinfo;

        // 修改还是新增-预留、待实现
        // todo
        if(this.data.postId){
            data['postId'] = this.data.postId;
        }

        wx.showLoading({
          title: '提交中...',
        });

        // 请求云函数
        wx.cloud.callFunction({
            name: fn,
            data: data
        }).then(res => {
            // 执行成功
            console.log(res);

            wx.hideLoading();

            if(res.result.errCode === 0) {
                wx.navigateBack();
            }else{
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