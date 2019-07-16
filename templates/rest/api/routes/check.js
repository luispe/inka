const Router = require("koa-router");
const checkController = require("../../app/check.js");
const router = new Router();

// Route for check listen API /check => GET
router.get("/check", checkController.getCheck);

module.exports = router;
