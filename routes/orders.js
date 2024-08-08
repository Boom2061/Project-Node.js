const express = require("express");
const productsSchema = require("../models/product");
const order = require("../models/order");
const router = express.Router();

router.post("/products/:id/orders", async function (req, res, next) {
  const { id } = req.params;
  const { quantity } = req.body;
  console.log(id + "จำนวน" + quantity);
  try {
    const product = await productsSchema.findById(id);
    if (!product) {
      return res.status(404).send({
        status: 404,
        message: "ไม่พบคำสังซื้อ",
        data: null,
      });
    }
    if (product.stock < quantity) {
      return res.status(400).send({
        status: 400,
        message: "สต็อกสินค้าไม่เพียงพอ",
        data: ["จำนวนสินค้าคงเหลือ" + " " + product.stock + " " + "ชิ้น"],
      });
    }

    const price = product.price;
    const totalPrice = price * quantity;

    // สร้างคำสั่งซื้อใหม่
    const newOrder = new order({
      product: id,
      quantity,
      totalPrice,
    });

    // อัปเดตสต็อกสินค้า
    product.stock -= quantity;
    await product.save();
    await newOrder.save();

    res.status(201).send({
      status: 201,
      message: "สร้างคำสั่งซื้อสำเร็จ",
      data: [newOrder],
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

router.get("/orders/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const orders = await order.findById(id);
    if (!orders) {
      return res.status(404).send({
        status: 404,
        message: "ไม่พบคำสังซื้อ",
        data: null,
      });
    }
    res.status(200).send({
      status: 200,
      message: "success",
      data: [orders],
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

router.get("/orders", async function (req, res, next) {
  try {
    const orders = await order.find({});
    res.status(200).send({
      status: 200,
      message: "success",
      data: [orders],
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

module.exports = router;
