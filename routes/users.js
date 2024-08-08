var express = require("express");
var router = express.Router();
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/* GET users listing. */

router.post("/login", async function (req, res, next) {
  try {
    const { name, password } = req.body;
    console.log(req.body);
    let user = await userSchema.findOne({ name });
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "ไม่พบผู้ใช้งาน",
        data: null,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        status: 400,
        message: "รหัสผ่านไม่ถูกต้อง",
        data: null,
      });
    }
    if (!user.is_approve) {
      return res.status(401).send({
        status: 401,
        message: "ไม่มีสิทธิ",
        data: null,
      });
    }
    const { password: pwd, ...userWithoutPassword } = user._doc;
    let userWithIsMatch = {
      ...userWithoutPassword,
      isMatch,
    };
    let token = await jwt.sign(userWithIsMatch, process.env.KEY_TOKEN);
    return res.status(201).send({
      status: 201,
      message: "success",
      data: ["Token ของคุณ =" + " " + token],
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }});
  
router.post("/register", async function (req, res, next) {
  try {
    const { name, password } = req.body;
    console.log(name, password);
    let newUser = await new userSchema({
      name: name,
      password: await bcrypt.hash(password, 10),
    }).save();
    // let user = await newUser.save();
    return res.status(201).send({
      status: 201,
      message: "Create success",
      data: newUser
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null
    });
  }
});

router.put("/approve/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    let user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "ไม่พบผู้ใช้งาน",
        data: null,
      });
    }
    user.is_approve = true;
    await user.save();
    return res.status(201).send({
      status: 201,
      message: "approve success",
      data: [user.name],
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

module.exports = router;

