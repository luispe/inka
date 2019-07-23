module.exports = function() {
  async function getCheck(req, res) {
    res.send({
      message: `CLI using expressJs, route ${
        req.originalUrl
      } everything working!`
    });
  }
  return {
    getCheck
  };
};
