/**
 * 记录分类配置模块
 * 2020-05-01
 *
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 */

// 记录类型配置-完整支持PICK
const postTypeConfig = [{
        id: 10,
        title: '吃喝',
        icon: 'icon-eat.png',
        items: [{
                id: 1010,
                title: '母乳',
                unit: 'ml'
            },
            {
                id: 1020,
                title: '牛奶',
                unit: 'ml'
            },
            {
                id: 1030,
                title: '辅食',
                unit: 'g'
            }
        ]
    },
    {
        id: 20,
        title: '睡觉',
        icon: 'icon-sleep.png',
        items: [{
                id: 2010,
                title: '睡觉',
                unit: 'h'
            }
        ]
    },
    {
        id: 30,
        title: '换裤',
        icon: 'icon-piss.png',
        items: [{
                id: 3010,
                title: '小便',
                unit: 'p'
            },
            {
                id: 3020,
                title: '大便',
                unit: 'p'
            }
        ]
    },
    {
        id: 40,
        title: '学习',
        icon: 'icon-study.png',
        items: [{
            id: 4010,
            title: '学习',
            unit: 'h'
        }]
    },
    {
        id: 50,
        title: '运动',
        icon: 'icon-sport.png',
        items: [{
            id: 5010,
            title: '运动',
            unit: 'h'
        }]
    },
    {
        id: 60,
        title: '玩乐',
        icon: 'icon-play.png',
        items: [{
            id: 6010,
            title: '玩乐',
            unit: 'h'
        }]
    },
    {
        id: 90,
        title: '其它',
        icon: 'icon-other.png',
        items: [{
            id: 9010,
            title: '其它',
            unit: 'z'
        }]
    }
];

/**
 * 记录类型配置通用类
 */
class PostConfig {

    constructor() {
        this.postTypeConfig = postTypeConfig;
    }

    getPostTypeItems(id) {
        let list = this.postTypeConfig,
            i = 0,
            l = list.length,
            item = list[0];
        for (i; i < l; i++) {
            if (id == list[i].id) {
                item = list[i];
                break;
            }
        }
        return item;
    }

    getDateList() {
        let res = [];

        for (let i = 0; i <= 5; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let w = date.getDay();

            if (m < 10) {
                m = '0' + m;
            }

            if (d < 10) {
                d = '0' + d;
            }

            let s = `${y}-${m}-${d}`;
            res.push(s);
        }

        return res;
    }

    /**
     * 自定义小时列表
     */
    getHourList() {
        let res = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                res.push('0' + i);
            } else {
                res.push(i + '');
            }
        }

        return res;
    }

    getMinuteList() {
        let res = [];
        for (let i = 0; i < 60; i += 5) {
            if (i < 10) {
                res.push('0' + i);
            } else {
                res.push(i + '');
            }
        }

        return res;
    }
}




export const postConfig = new PostConfig;