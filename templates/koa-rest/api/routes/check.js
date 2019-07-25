const Router = require("koa-router");
const respCheck = require("../check");
const router = new Router();

// Route for check listen API /check => GET
router.get("/check", respCheck.getCheck);

module.exports = router;
