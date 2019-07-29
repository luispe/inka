module.exports = {
  check: async () => {
    try {
      let message = `CLI using expressJs, route check ok, everything working!`;
      let statusCode = 200;
      let resp = { statusCode, message };
      return resp;
    } catch (error) {
      throw Error(error);
    }
  }
};
