module.exports = {
  check: async () => {
    try {
      let message = `CLI using expressJs, route check ok, everything working!`;
      let status = 200;
      let resp = { status, message };
      return resp;
    } catch (error) {
      throw Error(error);
    }
  }
};
