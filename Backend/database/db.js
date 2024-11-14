import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGODB_USER, MONGODB_PASS, MONGODB_DB } = process.env;

const url = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@babyview.gea2i.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority&appName=BabyView`;

mongoose.connect(url, {
    tls: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', function () {
    console.log("Conexión exitosa a la base de datos");
});

export default db;
