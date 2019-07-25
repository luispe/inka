const checkController = require("../app/check");
module.exports = {
  getCheck: async (req, res) => {
    try {
      let resp = await checkController.check();
      res.status(resp.status).json(resp.message);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
};
