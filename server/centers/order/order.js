const app = getApp();
 /**
 * 商务宴请获取订单列表
 * 请求参数 book_status    查询状态 0 全部|1 待确定| 2 待消费 | 3 待支付
 * page_size             每页多少条数据 最大值100
 * page                  当前页数 page 从1 开始
 */
const getOrderList = (order_type, page, page_size = 10) => new Promise((resolve, reject) => {
  app.Request.requestApi.oldPost({
    url: app.globalData.BASE_API_URL,
    params: {
      service: 'pay',
      method: 'get_order_record',
      data: JSON.stringify({
        order_type: order_type,
        page: page,
        page_size: page_size
      })
    }
  }, resolve, reject)
});

module.exports = {
  getOrderList
};
