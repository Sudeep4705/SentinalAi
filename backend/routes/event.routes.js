const express = require("express")
const router = express.Router()
const eventContoller = require("../controllers/event.controller")



router.get("/events",eventContoller.event)
module.exports = router