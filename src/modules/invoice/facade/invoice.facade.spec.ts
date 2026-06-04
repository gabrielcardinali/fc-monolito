import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceItemsModel from "../repository/invoice-items.model";
import InvoiceModel from "../repository/invoice.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: "John Doe",
      document: "123456789",
      street: "Main St",
      number: "100",
      complement: "Apt 1",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      items: [
        { id: "item-1", name: "Product A", price: 50 },
        { id: "item-2", name: "Product B", price: 75 },
      ],
    };

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.items).toHaveLength(2);
    expect(output.total).toBe(125);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const generated = await facade.generate({
      name: "Jane Doe",
      document: "987654321",
      street: "Elm St",
      number: "200",
      complement: "",
      city: "Shelbyville",
      state: "IL",
      zipCode: "62565",
      items: [{ id: "item-3", name: "Product C", price: 30 }],
    });

    const output = await facade.find({ id: generated.id });

    expect(output.id).toBe(generated.id);
    expect(output.name).toBe("Jane Doe");
    expect(output.address.street).toBe("Elm St");
    expect(output.items).toHaveLength(1);
    expect(output.total).toBe(30);
    expect(output.createdAt).toBeDefined();
  });
});
