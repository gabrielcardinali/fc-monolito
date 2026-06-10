import express from "express";
import productsRouter from "./routes/products.route";
import clientsRouter from "./routes/clients.route";
import checkoutRouter from "./routes/checkout.route";
import invoiceRouter from "./routes/invoice.route";

const app = express();

app.use(express.json());
app.use("/products", productsRouter);
app.use("/clients", clientsRouter);
app.use("/checkout", checkoutRouter);
app.use("/invoice", invoiceRouter);

export default app;
