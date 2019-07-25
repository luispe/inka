module.exports = function(app) {
  const express = require("express");
  const router = express.Router();
  const respCheck = require("../check");
  // Route for check listen API /check => GET
  router.get("/check", respCheck.getCheck);

  app.use("/", router);
};
