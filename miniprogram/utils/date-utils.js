/**
 * Betababy v1.0
 * 2020-03-30
 *
 * 日期相关工具模块
 *
 * Eyson You
 * youyansen@gmail.com
 * http://eyson.cn/
 * 公众号：尤点意思
 */
class DateUtils {

    constructor() {
        this._timestamp = this.getTimestamp();
    }
    
    /**
     * 计算时间返回 [YYYY-mm-dd, H:m:s] 格式的方法
     * timestamp 时间戳
     */
    format(timestamp) {
        timestamp = timestamp ? timestamp : this.getTimestamp();
        let date = new Date(timestamp);
        let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        let hh = date.getHours(), mm = date.getMinutes(), ii = date.getSeconds();

        // 月
        if(m < 10) {
            m = '0' + m;
        }

        // 日
        if(d < 10) {
            d = '0' + d;
        }

        // 时
        if(hh < 10) {
            hh = '0' + hh;
        }

        // 分
        if(mm < 10) {
            mm = '0' + mm;
        }

        // 秒
        if(ii < 10) {
            ii = '0' + ii;
        }

        let ds = [y, m , d];
        let ts = [hh, mm, ii];
        
        return [ds.join('-'), ts.join(':')];
    }

    getTimestamp() {
        return (new Date()).getTime();
    }

    getDate(timestamp) {
        return this.format(timestamp)[0];
    }

    getTime(timestamp) {
        return this.format(timestamp)[1];
    }

    getDateTime(timestamp) {
        return this.format(timestamp).join(' ');
    }
}





export const dateUtils = new DateUtils();