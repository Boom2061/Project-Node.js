var express = require("express");
var router = express.Router();
const productsSchema = require("../models/product");
// const product = require('../models/product');

router.get("/products", async function (req, res, next) {
  try {
    const products = await productsSchema.find({});
    res.status(200).send({
      status: 200,
      message: "suscess",
      data: [products],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

router.get("/products/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const products = await productsSchema.findById(id);
    if (!products) {
      return res.status(404).send({
        status: 404,
        message: "ไม่พบผลิตภัณฑ์นี้",
        data: [],
      });
    }
    res.status(200).send({
      status: 200,
      message: "suscess",
      data: [products],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

router.post("/products", async function (req, res, next) {
  const { name, price, stock } = req.body;
  try {
    const newProduct = await productsSchema.create({ name, price, stock });
    return res.status(201).send({
      status: 201,
      message: "เพิ่มสินค้าสำเร็จ",
      data: [newProduct],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

router.put("/products/:id", async function (req, res, next) {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  try {
    const Product = await productsSchema.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true, runValidators: true }
    );
    if (!Product) {
      return res.status(404).send({ message: "ไม่พบสินค้า" });
    }
    res.status(201).send({
      status: 201,
      message: "อัปเดตสินค้าสำเร็จ",
      data: [Product],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

router.delete("/products/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const Product = await productsSchema.findByIdAndDelete(id);
    if (!Product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }
    res.status(201).send({
      status: 201,
      message: "ลบสินค้าสำเร็จ",
      data: [],
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      status: 500,
      message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์",
      data: null,
    });
  }
});

module.exports = router;
