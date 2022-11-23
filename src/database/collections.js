import db from "./db.js";

const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");
const productsCollection = db.collection("products");
const cartsCollection = db.collection("carts");

export {
    usersCollection,
    sessionsCollection,
    productsCollection,
    cartsCollection,
};
