/**
 * 工具函数封装
 */
 export default {
    //时间格式化 formateDate(new Date('2021-01-17T13:32:06.381Z'))
    formateDate(date, format) {
        let fmt = format || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
            }
        }
        return fmt;
    },
    //金钱格式化 number_format(1234567.089, 2, ".", ",");//1,234,567.09
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * 
    */
    number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };
    
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    deepClone(obj){
        //先判断传入的obj是不是引用类型，不是的话直接返回
        if(typeof obj !== "object" || obj == null){
            return obj;
        }
        //然后判断obj是对象还是数组
        var result;
        if(obj instanceof Array){
            result = [];
        }else{
            result = {};
        }
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                //判断key是不是自身属性
                result[key] = this.deepClone(obj[key]);
            }
        }
        return result;
    },
    // 递归遍历生成路由表
    gennerateRoutes(list) {
        var result = []
        list.forEach(item=>{
            if (item.children && item.btnList) {
                result.push({
                    path: item.path,
                    name: item.component,
                    component:() => import(`../views/${item.component}/${item.component}.vue`),
                    meta:{
                        name: item.menuName
                    }
                })
            } else if (item.children && !item.btnList) {
                result = result.concat(this.gennerateRoutes(item.children))
            }
        })
        return result
    }
}