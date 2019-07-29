const checkController = require("../app/check");
module.exports = {
  getCheck: async (req, res, next) => {
    try {
      let resp = await checkController.check();
      res.status(resp.statusCode).json(resp.message);
    } catch (error) {
      next(error);
    }
  }
};
