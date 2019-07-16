module.exports = {
  getCheck: ctx => {
    ctx.body = {
      message: `CLI using Koa, route ${ctx.originalUrl} everything working!`
    };
  }
};
