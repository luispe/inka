const routesLoader = require("../utils/routes-loader");

module.exports = function(app) {
  routesLoader(`${__dirname}`).then(files => {
    files.forEach(route => {
      app.use(route.routes()).use(
        route.allowedMethods({
          throw: true
        })
      );
    });
  });
};
