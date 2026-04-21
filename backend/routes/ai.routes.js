const express = require("express")
const router = express.Router()
const Aicontroller = require("../controllers/ai.controller")


router.post("/ai-summary",Aicontroller.Aiprompt);


module.exports = router
