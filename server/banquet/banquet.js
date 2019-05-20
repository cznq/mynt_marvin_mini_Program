const app = getApp();
 /**
 * 商务宴请获取订单列表
 * 请求参数 book_status    查询状态 0 全部|1 待确定| 2 待消费 | 3 待支付
 * page_size             每页多少条数据 最大值100
 * page                  当前页数 page 从1 开始
 */
const getOrderList = (book_status, page_size, page) => new Promise((resolve, reject) => {
  app.Request.requestApi.post({
    url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_list",
    params: {
      data: JSON.stringify({
        book_status: book_status,
        page_size: page_size,
        page: page
      })
    }
  }, resolve, reject)
});

module.exports = {
  getOrderList
};
