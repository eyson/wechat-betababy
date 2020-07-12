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
        isShow: false,
        // 图片上传限制
        imgUploadMax: 1,
        // 上传文件-文件列表
        files: [],
        fileId: '',
        // 修改时传入
        babyId: null,
        babyInfo: {},
        babyInfoOld: {},
        // 生日
        birthday: '0000-00-00',
        // 性别、默认男
        sexPickerIndex: 0,
        sexPickerList: ['男', '女']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取页面URL参数
        // console.log(options);
        const isUpdate = options.babyId ? true : false; // 页面带参数为修改记录
        const title = isUpdate ? '修改信息' : '添加宝宝'; // 标题显示逻辑

        // 设置页面标题
        wx.setNavigationBarTitle({
            title: title
        });

        // 保存参数
        this.setData({
            babyId: options.babyId ? options.babyId : null
        });

        // 如果是修改，查询宝宝详情
        if (isUpdate) {
            // 查询完成后再设置isshow
            this.getBabyDetail();
        } else {
            // 添加的时候直接显示
            this.setData({
                isShow: true
            });
        }
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
        // console.log(app.globalData);
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
     * 用户添加宝宝
     */
    bindSubmit: function (e) {
        // 表单数据
        let data = e.detail ? e.detail.value : {};
        // 登录用户
        let userinfo = app.globalData.$userInfo;
        // 新增还是修改
        let fn = this.data.babyId ? 'updateBaby' : 'addBaby';

        data['birthday'] = this.data.birthday;
        data['sex'] = this.data.sexPickerIndex;
        console.log(data);

        if (!this.check(data, 'name', '请输入昵称')) {
            return;
        }

        if (data.birthday === '0000-00-00') {
            wx.showToast({
                title: '请选择生日'
            })
            return;
        }

        if (!this.check(data, 'height', '请输入身高')) {
            return;
        }

        if (!this.check(data, 'weight', '请输入体重')) {
            return;
        }

        // 头像文件ID
        data['fileId'] = this.data.fileId;
        data['userInfo'] = userinfo;

        // 修改还是新增
        if (this.data.babyId) {
            data['babyId'] = this.data.babyId;
            
            // 是否写流水
            if(data['height'] != this.data.babyInfoOld.detail.height){
                data['isHeightLogs'] = 1;
            }

            if(data['weight'] != this.data.babyInfoOld.detail.weight){
                data['isWeightLogs'] = 1;
            }
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

            if (res.result.errCode === 0) {
                if (res.result.babyId) {
                    // 修改成功，跳详情页
                    wx.redirectTo({
                        url: `/pages/baby/detail/detail?babyId=${res.result.babyId}`,
                    });
                } else {
                    // 新增成功，返回上页
                    wx.navigateBack();
                }

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
                let baby = res.result.data;
                this.setData({
                    isShow: true,
                    babyInfo: baby,
                    babyInfoOld: baby,
                    fileId: baby.detail.fileId,
                    files: [baby.detail.fileId],
                    birthday: baby.detail.birthday,
                    sexPickerIndex: baby.detail.sex
                });
            } else {
                this.setData({
                    isShow: false,
                    birthday: '0000-00-00',
                    sexPickerIndex: 0,
                    babyInfo: {},
                    babyInfoOld: {}
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
                birthday: '0000-00-00',
                sexPickerIndex: 0,
                babyInfo: {},
                babyInfoOld: {}
            });
            wx.hideLoading();
            wx.showToast({
                title: '系统异常，请重试',
                icon: 'none'
            });
        });
    },

    /**
     * 生日日期控件
     */
    birthdayPickerChange: function (e) {
        let v = e.detail.value;
        this.setData({
            birthday: v
        });
    },

    /**
     * 性别下拉组件
     */
    sexPickerChange: function (e) {
        let v = e.detail.value;
        this.setData({
            sexPickerIndex: v
        });
    },

    /**
     * 简单的数据验证方法
     * @param {Object} o 要检测的数据对象
     * @param {String} k 对象Key属性
     * @param {String} s 提示标题内容
     */
    check: function (o, k, s) {
        if (!o[k]) {
            wx.showToast({
                title: s,
                icon: 'none'
            });

            return false;
        } else {
            return true;
        }
    },

    /**
     * 上传图片
     */
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            // 只能上传一张
            count: that.imgUploadMax,
            // 可以指定是原图还是压缩图，默认二者都有
            sizeType: ['original', 'compressed'],
            // 可以指定来源是相册还是相机，默认二者都有
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.showLoading({
                    title: '上传中...',
                });

                let filePath = res.tempFilePaths[0];

                // 返回选定照片的本地文件路径列表
                // tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    // 只能上传一张，每次会覆盖
                    files: res.tempFilePaths
                    // files: that.data.files.concat(res.tempFilePaths)
                });
                // console.log(res);
                // console.log(that.data.files);


                // get file EXT,for .jpg
                let ext = filePath.match(/\.[^.]+?$/)[0];
                let time = (new Date()).getTime();
                let rand = parseInt(Math.random() * 100000);
                let cloudPath = `img_avatar_${time}_${rand}${ext}`;
                console.log(cloudPath);
                wx.cloud.uploadFile({
                    cloudPath: cloudPath,
                    filePath: filePath,
                    success: function (res) {
                        // 图片上传成功
                        console.log(res);
                        that.setData({
                            fileId: res.fileID
                        });

                        // 鉴定敏感图片
                        let contentType = ext.replace(/\./g, '');
                        console.log(contentType);
                        wx.cloud.callFunction({
                            name: 'imgSecCheck',
                            data: {
                                contentType: 'image/png',
                                fileId: res.fileID
                            }
                        }).then(res => {
                            // 图片上传成功
                        }).catch(err => {
                            console.log(err);
                            // 删除文件
                            const fileList = that.data.files;
                            wx.cloud.deleteFile({
                                fileList: fileList
                            }).then(r => {
                                console.log(r);
                            });

                            // 敏感图片，清空参数值
                            that.setData({
                                fileId: '',
                                files: []
                            });

                            wx.showModal({
                                title: '提示',
                                content: '图片上传失败'
                            });
                        });
                    },
                    fail: function (e) {
                        // todo
                        console.log(e);
                    },
                    complete: function () {
                        wx.hideLoading();
                    }
                });
            },
            fail: function (e) {
                console.log('----upload fail----');
                console.log(e);
            },
            complete: function (res) {
                wx.hideLoading();
            }
        });
    }
})