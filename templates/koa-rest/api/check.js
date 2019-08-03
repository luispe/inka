const checkController = require("../app/check");
module.exports = {
  getCheck: async ctx => {
    try {
      let resp = await checkController.check();
      ctx.status = resp.statusCode;
      ctx.body = resp.message;
    } catch (error) {
      ctx.throw(500, error.message);
    }
  }
};
