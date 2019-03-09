/**
 * 圆角图片 
 */
function circleImg(ctx, img, x, y, w, h, r, callback = function(){}) {
  var that = this;
  wx.getImageInfo({
    src: img,
    success: function (res) {
      console.log(res);
      ctx.save();
      ctx.beginPath(); //开始绘制
      //先画个圆角矩形
      that.roundRect(ctx, x, y, w, h, r, '#fff');
      ctx.clip(); 
      ctx.drawImage(res.path, x, y, w, h);
      ctx.restore(); 
      callback();
    }
  })
}

/**
 * 绘制带圆角的矩形
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param x  矩形左上角横坐标
 * @param y  矩形左上角纵坐标
 * @param w  矩形长
 * @param h  矩形宽
 * @param r  圆角半径
 * @param bg 背景颜色值
 */
function roundRect(ctx, x, y, w, h, r, bg) {
  // 开始绘制
  ctx.beginPath()
  ctx.setFillStyle(bg)
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)
  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  ctx.closePath()
}

/**
 * 绘制居中文字
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param fontSize  字体大小
 * @param fontColor  字体颜色
 * @param align  文字对齐方式
 * @param Text  文字
 * @param x  文字起始横坐标
 * @param y  文字起始纵坐标
 */
function drawText(ctx, fontSize, fontColor, align, Text, x, y) {
  ctx.setFontSize(fontSize)
  ctx.setFillStyle(fontColor)
  ctx.setTextAlign(align)
  ctx.fillText(Text, x, y)
}

/**
 * 绘制圆点
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param x  圆心横坐标
 * @param y  圆心纵坐标
 * @param r  圆半径
 * @param bg  背景色
 */
function drawDot(ctx, x, y, r, bg) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.setFillStyle(bg)
  ctx.fill()
}

/**
 * 绘制矩形
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param x  矩形左上角横坐标
 * @param y  矩形左上角纵坐标
 * @param w  矩形长
 * @param h  矩形宽
 * @param bg  背景色
 */
function drawRect(ctx, x, y, w, h, bg) {
  ctx.setFillStyle(bg);
  ctx.fillRect(x, y, w, h);
}

/**
 * 绘制矩形虚线框
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param x  矩形左上角横坐标
 * @param y  矩形左上角纵坐标
 * @param w  矩形长
 * @param h  矩形宽
 * @param offset  虚线之间的间隔
 */
function drawDashLineRect(ctx, x, y, w, h, offset) {
  ctx.setStrokeStyle('#dbdee5');
  ctx.setLineDash([5, 6], offset);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+w, y);
  ctx.lineTo(x+w, y+h);
  ctx.lineTo(x, y+h);
  ctx.lineTo(x, y);
  ctx.stroke();
}

/**
 * 绘制网络图片
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param img  图片链接
 * @param x  图片左上角横坐标
 * @param y  图片左上角纵坐标
 * @param w  图片长
 * @param h  图片宽
 * @param callback  回调函数
 */
function drawNetworkPhoto(ctx, img, x, y, w, h, callback = function(){}) {
  wx.getImageInfo({
    src: img,
    success: function (res) {
      console.log(res);
      ctx.save();
      ctx.beginPath(); //开始绘制
      callback();
      ctx.drawImage(res.path, x, y, w, h);
      //ctx.restore();
    }
  })
}

/**
 * 绘制图片，保持宽高比居中裁剪，短边完全展示，长边居中截取
 * @param ctx  wx.createCanvasContext返回的canvas绘图上下文
 * @param picFile 图片临时文件路径
 * @param picInfo wx.getImageInfo返回的图片原始信息
 * @param x   左上角横坐标
 * @param y   左上角纵坐标
 * @param w   宽度
 * @param h   高度
 * @param bgColor 背景色，裁剪后多余部分用背景色擦除
 * 说明：
 *    1.应先绘制图片，后填充图片周边内容，否则图片周边长边方向内容可能会被部分擦除
 *    2.在开发者工具上图片多余部分无法被清除，但在真机上正常
 *
 */
function aspectFill({ ctx, picFile, picInfo, x, y, w, h, bgColor = "#ffffff" }) {
  let aspect = picInfo.width / picInfo.height;  //图片宽高比
  let [dx, dy, dw, dh] = [0, 0, 0, 0]; //整张图片绘制位置
  let extras = [];  //需擦除的多余区域
  if (aspect < w / h) {
    dw = w;
    dh = dw / aspect;
    dx = x;
    dy = y - (dh - h) / 2;
    extras = [[dx - 1, dy - 1, dw + 2, (dh - h) / 2 + 1], [dx - 1, dy + (dh - h) / 2 + h, dw + 2, (dh - h) / 2 + 1]]; //为避免残余半像素的细线，擦除方向多加1px
  } else {
    dh = h;
    dw = dh * aspect;
    dx = x - (dw - w) / 2;
    dy = y;
    extras = [[dx - 1, dy - 1, (dw - w) / 2 + 1, dh + 2], [dx + (dw - w) / 2 + w, dy - 1, (dw - w) / 2 + 1, dh + 2]];//为避免残余半像素的细线，擦除方向多加1px
  }
  ctx.drawImage(picFile, dx, dy, dw, dh); //保持宽高比，缩放至指定区域后，绘制整张图片
  ctx.save();
  ctx.setFillStyle(bgColor);
  for (let extra of extras) { //擦除整张图片中多余区域
    let [ex, ey, ew, eh] = extra;
    if (ex + ew <= 0 || ey + eh <= 0)
      continue;
    if (ex < 0) {
      ew -= Math.abs(ex);
      ex = 0;
    }
    if (ey < 0) {
      eh -= Math.abs(ey);
      ey = 0;
    }
    ctx.fillRect(ex, ey, ew, eh);
  }
  ctx.restore();
}

/**
 * 将方形区域切成圆形，场景示例：将头像切成圆形展示
 * @param ctx wx.createCanvasContext返回的canvas绘图上下文
 * @param x   左上角横坐标
 * @param y   左上角纵坐标
 * @param w   宽度/高度/圆的直径
 * @param bgColor 背景色，擦除部分以背景色填充
 */
function rounded(ctx, x, y, w, bgColor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(w, w / 2);
  ctx.arc(w / 2, w / 2, w / 2, 0, 2 * Math.PI, false);
  ctx.lineTo(w, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, w);
  ctx.lineTo(w, w);
  ctx.closePath();
  ctx.setFillStyle(bgColor);
  ctx.fill();
  ctx.restore();
}

/**
 * 将矩形切成圆角矩形
 * @param ctx wx.createCanvasContext返回的canvas绘图上下文
 * @param x   矩形左上角横坐标
 * @param y   矩形左上角纵坐标
 * @param w   矩形宽度
 * @param h   矩形高度
 * @param radius  圆角半径
 * @param bgColor 背景色，擦除部分以背景色填充
 */
function borderRadius({ ctx, x, y, w, h, radius, bgColor = "#ffffff" }) {
  ctx.save();
  ctx.translate(x, y);

  ctx.setFillStyle(bgColor);

  //擦除左上角多余部分
  ctx.beginPath();
  ctx.moveTo(0, 0 + radius);
  ctx.quadraticCurveTo(0, 0, 0 + radius, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  //擦除右上角多余部分
  ctx.beginPath();
  ctx.moveTo(w - radius, 0);
  ctx.quadraticCurveTo(w, 0, w, radius);
  ctx.lineTo(w, 0);
  ctx.closePath();
  ctx.fill();

  //擦除右下角角多余部分
  ctx.beginPath();
  ctx.moveTo(w - radius, h);
  ctx.quadraticCurveTo(w, h, w, h - radius);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  //擦除左下角多余部分
  ctx.beginPath();
  ctx.moveTo(0, h - radius);
  ctx.quadraticCurveTo(0, h, 0 + radius, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * 绘制文本，支持\n换行
 * @param ctx   wx.createCanvasContext返回的canvas绘图上下文
 * @param text  文本内容，支持\n换行
 * @param x     文本区域（含行高）左上角横坐标；居中对齐时，改取中点横坐标
 * @param y     文本区域（含行高）左上角纵坐标
 * @param fontSize  字号，单位：px
 * @param color     颜色
 * @param lineHeight  行高
 * @param textAlign   水平对齐方式，支持'left'、'center'
 */
function fillText(ctx, text, x, y, fontSize, color, lineHeight, textAlign) {
  ctx.save();

  lineHeight = lineHeight || fontSize;
  fontSize && ctx.setFontSize(fontSize);
  color && ctx.setFillStyle(color);
  textAlign && ctx.setTextAlign(textAlign);

  let lines = text.split('\n');
  for (let line of lines) {
    ctx.fillText(line, x, y + lineHeight - (lineHeight - fontSize) / 2);
    y += lineHeight;
  }

  ctx.restore();
}

/**
 * 字符串过长截断，1个字母长度计为1,1个汉字长度计为2
 * @param {string} str 原字符串
 * @param {number} len 最大长度
 * @param {boolean} ellipsis 过长时截断后是否加'...'
 * @return {string} 截断后字符串
 */
function ellipsisStr(str, len, ellipsis = true) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    let a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat(ellipsis && (str_length > len || i + 1 < str_len) ? "..." : "");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str;
  }
}

/**
 * 字符串长度，1个字母长度计为1,1个汉字长度计为2
 * canvas目前似乎不支持获取文本绘制后所占宽度，只能根据字数粗略计算了
 */
function strLenGraphic(str) {
  var str_length = 0;
  for (var i = 0; i < str.length; i++) {
    let a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
  }
  return str_length;
}

module.exports = {
  circleImg: circleImg,
  roundRect: roundRect,
  drawText: drawText,
  drawNetworkPhoto: drawNetworkPhoto,
  drawDot: drawDot,
  drawRect: drawRect,
  aspectFill: aspectFill,
  rounded: rounded,
  drawDashLineRect: drawDashLineRect,
  borderRadius: borderRadius,
  fillText: fillText,
  ellipsisStr: ellipsisStr,
  strLenGraphic: strLenGraphic
}
