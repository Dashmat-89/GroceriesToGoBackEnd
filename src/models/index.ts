import mongoose from "mongoose";
import CartItems from "./CartItems";
import Product from "./product";
import OrderedItem from "./orderedItem";
import dbConnect from "@/lib/mongodb";
import Receipt from "./receipt";
// import Product from "./Product.js";
// import CartItems from "./CartItems.js";
// import OrderedItems from "./OrderedItems.js";

// mongoose.connect(
//   "mongodb+srv://dashmat:F61R5rIq94vhPYEE@nextbackend.zserr.mongodb.net/nextBackend?retryWrites=true&appName=NextBackend"
// );

await dbConnect();

let order_id = 1;

export async function getCartItems() {
  const cart = await CartItems.find({}).sort({ product_id: 1 }).exec();
  return cart;
}

export async function addCartItem(id) {
  const product = await Product.findById(id).exec();
  console.log(product);
  const item = await CartItems.findOne({ product_id: id }).exec();

  if (!item) {
    const newItem = await CartItems.create({
      product_id: id,
      quantity: 1,
      tax_cost: product.tax_rate,
      unit_cost: product.cost_price,
    });

    return newItem;
  }

  const updatedItem = await CartItems.findByIdAndUpdate(
    item._id,
    {
      quantity: Number(item.quantity) + 1,
      // unit_cost: Number(item.unit_cost) + product.cost_price,
      // tax_cost: Number(item.tax_cost) + product.tax_rate,
    },
    { new: true }
  );

  return updatedItem;
}

export async function removeCartItem(id) {
  const product = await Product.findById(id).exec();
  const item = await CartItems.findOne({ product_id: id }).exec();

  if (item == null) {
    return null;
  }

  if (item.quantity == 1) {
    await CartItems.findByIdAndDelete(item._id).exec();
    return { message: "ok" };
  }

  const updatedItem = await CartItems.findByIdAndUpdate(
    item._id,
    {
      quantity: Number(item.quantity) - 1,
      // unit_cost: Number(item.unit_cost) - product.cost_price,
      // tax_cost: Number(item.tax_cost) - product.tax_rate,
    },
    { new: true }
  );

  return updatedItem;
}

export async function deleteCartItem(id) {
  const product = await Product.findById(id).exec();
  const item = await CartItems.findOne({ product_id: id }).exec();

  if (item == null) {
    return null;
  }

  await CartItems.findByIdAndDelete(item._id).exec();
  return { message: "ok" };
}

export async function getProductsFromCart(cart) {
  let products = [];
  for (let item of cart) {
    const product = await getProductDetails(item.product_id);
    products.push(product);
  }

  return products;
}

export async function getAllProducts() {
  const products = await Product.find({}).exec();
  return products;
}

export async function getProductDetails(id) {
  const product = await Product.findById(id).exec();
  return product;
}

export async function addProduct(product) {
  const newProduct = await Product.create(product);
  console.log(product);
  console.log(newProduct);
  return newProduct;
}

export async function deleteProduct(id) {
  await Product.findByIdAndDelete(id).exec();
}

export async function updateProduct(id, body) {
  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    new: true,
  });

  return updatedProduct;
}

export async function addCartItemstoOrders({
  user_email,
  order_id,
  subtotal,
  quantity,
  tax_cost,
  received_by,
  phone_number,
  payment_method,
}: {
  user_email: string;
  order_id: Number;
  subtotal: Number;
  quantity: Number;
  tax_cost: Number;
  received_by: string;
  phone_number: Number;
  payment_method: string;
}) {
  const cartItems = await CartItems.find({}).exec();
  cartItems.forEach(async (item) => {
    const res = await OrderedItem.create({
      order_id: order_id,
      user_id: user_email,
      product_id: item.product_id,
      unit_cost: item.unit_cost,
      tax_cost: item.tax_cost,
      quantity: item.quantity,
      subtotal: item.unit_cost * item.quantity + item.tax_cost,
    });
    const productQuantity = await Product.findById({ _id: item.product_id });
    let newQuantity = 0;
    if (productQuantity.stock_quantity >= item.quantity) {
      newQuantity = productQuantity.stock_quantity - item.quantity;
    } else {
      newQuantity = 0;
    }

    const updateQuantity = await Product.findOneAndUpdate(
      {
        _id: item.product_id,
      },
      { stock_quantity: newQuantity }
    );
    if (!res || !updateQuantity) {
      return null;
    }
  });
  const receipt = await Receipt.create({
    order_id: order_id,
    internal_user_id: user_email,
    received_by: received_by,
    tax_cost: Number(tax_cost),
    subtotal: Number(subtotal),
    phone_number: Number(phone_number),
    payment_method: payment_method,
    total: Number(subtotal) + Number(tax_cost),
  });

  await CartItems.deleteMany({}).exec();

  return { data: { receipt: receipt } };
}

export async function getAllOrders() {
  const orders = await OrderedItem.find({}).exec();
  return orders;
}
