import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../../migrations";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import StoreCatalogProductModel from "../../store-catalog/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceItemsModel from "../../invoice/repository/invoice-items.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import OrderItemModel from "../repository/order-item.model";
import OrderModel from "../repository/order.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";

describe("CheckoutFacade test", () => {
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

  it("should place an order with approved payment", async () => {
    const productId = "prod-1";
    const clientId = "client-1";
    const now = new Date();

    // Seed product in both adm_products and store_catalog_products
    await ProductAdmModel.create({
      id: productId,
      name: "Product A",
      description: "Desc A",
      purchasePrice: 50,
      stock: 10,
      createdAt: now,
      updatedAt: now,
    });
    await StoreCatalogProductModel.create({
      id: productId,
      name: "Product A",
      description: "Desc A",
      salesPrice: 100,
    });

    // Seed client
    await ClientModel.create({
      id: clientId,
      name: "John Doe",
      email: "john@doe.com",
      document: "123.456.789-00",
      street: "Rua 1",
      number: "100",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipcode: "01310-100",
      createdAt: now,
      updatedAt: now,
    });

    const facade = CheckoutFacadeFactory.create();
    const output = await facade.placeOrder({
      clientId,
      products: [{ productId }],
    });

    expect(output.id).toBeDefined();
    expect(output.status).toBe("approved");
    expect(output.invoiceId).toBeTruthy();
    expect(output.total).toBe(100);
    expect(output.products).toEqual([{ productId }]);
  });
});
