import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../migrations";
import app from "./express";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";
import OrderModel from "../modules/checkout/repository/order.model";
import InvoiceItemsModel from "../modules/invoice/repository/invoice-items.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { ProductModel as ProductAdmModel } from "../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../modules/store-catalog/repository/product.model";

describe("API e2e test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    sequelize.addModels([
      ProductAdmModel,
      StoreCatalogProductModel,
      ClientModel,
      TransactionModel,
      InvoiceModel,
      InvoiceItemsModel,
      OrderModel,
      OrderItemModel,
    ]);
    await migrator(sequelize).up();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should complete the purchase flow through HTTP", async () => {
    const productInput = {
      id: "product-1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 50,
      salesPrice: 100,
      stock: 10,
    };

    const productResponse = await request(app)
      .post("/products")
      .send(productInput);

    expect(productResponse.status).toBe(201);
    expect(productResponse.body).toMatchObject(productInput);
    expect(productResponse.body.createdAt).toBeDefined();
    expect(productResponse.body.updatedAt).toBeDefined();

    const clientInput = {
      id: "client-1",
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
      address: {
        street: "Main St",
        number: "100",
        complement: "Apt 1",
        city: "Sao Paulo",
        state: "SP",
        zipCode: "01310-100",
      },
    };

    const clientResponse = await request(app)
      .post("/clients")
      .send(clientInput);

    expect(clientResponse.status).toBe(201);
    expect(clientResponse.body).toMatchObject(clientInput);
    expect(clientResponse.body.createdAt).toBeDefined();
    expect(clientResponse.body.updatedAt).toBeDefined();

    const checkoutResponse = await request(app)
      .post("/checkout")
      .send({
        clientId: clientInput.id,
        products: [{ productId: productInput.id }],
      });

    expect(checkoutResponse.status).toBe(200);
    expect(checkoutResponse.body).toMatchObject({
      status: "approved",
      total: productInput.salesPrice,
      products: [{ productId: productInput.id }],
    });
    expect(checkoutResponse.body.id).toBeDefined();
    expect(checkoutResponse.body.invoiceId).toBeDefined();

    const invoiceResponse = await request(app).get(
      `/invoice/${checkoutResponse.body.invoiceId}`
    );

    expect(invoiceResponse.status).toBe(200);
    expect(invoiceResponse.body).toMatchObject({
      id: checkoutResponse.body.invoiceId,
      name: clientInput.name,
      document: clientInput.document,
      address: clientInput.address,
      items: [
        {
          id: productInput.id,
          name: productInput.name,
          price: productInput.salesPrice,
        },
      ],
      total: productInput.salesPrice,
    });
    expect(invoiceResponse.body.createdAt).toBeDefined();
  });
});
