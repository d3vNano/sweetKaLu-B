import db from "./db.js";

const usersCollection = db.collection("users");
const productsCollection = db.collection("products");
const cartsCollection = db.collection("carts");
const ordersCollection = db.collection("orders");

export {
    usersCollection,
    productsCollection,
    cartsCollection,
    ordersCollection,
};
