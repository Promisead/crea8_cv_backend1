const express = require("express")
const { allCvs,login,signup,updateAccount,createCv } = require("../controller/user")
const router = express.Router()

//auth route
router.post("/login",login)
router.post('/signup', signup)
router.post('/updateaccount/:id', updateAccount)

//fetch all cvs
router.get('/cvs/:id', allCvs)
router.post('/makecv/:id', createCv)












exports.router = router