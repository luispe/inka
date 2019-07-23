module.exports = function(app) {
  const express = require("express");
  const router = express.Router();
  const checkController = require("../../app/check.js")();

  // Route for check listen API /check => GET
  router.get("/check", checkController.getCheck);
  router.post("/check", checkController.getCheck);

  app.use("/", router);
};
