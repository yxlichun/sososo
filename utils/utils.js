const Utils = {};
/**
 * [日期转化工具]
 * @param  {[date]} dateobj [日期对象]
 * @param  {[string]} format [转化格式 yyyy-MM-dd hh:mm:ss]
 * @return {[string]}
 * @author lichun
 */
Utils.formatDate = (dateobj, format = 'yyyy-MM-dd hh:mm:ss') => {
    const date = {
      'M+': dateobj.getMonth() + 1,
      'd+': dateobj.getDate(),
      'h+': dateobj.getHours(),
      'm+': dateobj.getMinutes(),
      's+': dateobj.getSeconds(),
      'q+': Math.floor((dateobj.getMonth() + 3) / 3),
      'S+': dateobj.getMilliseconds(),
    };
    if (/(y+)/i.test(format)) {
      // eslint-disable-next-line
      format = format.replace(RegExp.$1, (`${dateobj.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    // eslint-disable-next-line
    for (let k in date) {
      if (new RegExp(`(${k})`).test(format)) {
        // eslint-disable-next-line
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
              ? date[k] : (`00${date[k]}`).substr((`${date[k]}`).length));
      }
    }
    return format;
  };

  module.exports = Utils;