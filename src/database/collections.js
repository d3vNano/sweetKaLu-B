import db from "./db.js";

const usersCollection = db.collection("users");
const productsCollection = db.collection("products");
const cartsCollection = db.collection("carts");

export { usersCollection, productsCollection, cartsCollection };
