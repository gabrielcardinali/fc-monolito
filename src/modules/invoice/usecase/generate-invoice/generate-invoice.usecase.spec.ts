import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice-items.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "John Doe",
  document: "123456789",
  address: new Address("Street 1", "123", "Apt 1", "City", "State", "12345"),
  items: [
    new InvoiceItems({ id: new Id("1"), name: "Item 1", price: 100 }),
    new InvoiceItems({ id: new Id("2"), name: "Item 2", price: 200 }),
  ],
});

const MockRepository = () => ({
  generate: jest.fn().mockResolvedValue(invoice),
  find: jest.fn(),
});

describe("GenerateInvoiceUseCase unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: "John Doe",
      document: "123456789",
      street: "Street 1",
      number: "123",
      complement: "Apt 1",
      city: "City",
      state: "State",
      zipCode: "12345",
      items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
      ],
    };

    const result = await usecase.execute(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe("Street 1");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("Apt 1");
    expect(result.city).toBe("City");
    expect(result.state).toBe("State");
    expect(result.zipCode).toBe("12345");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "1", name: "Item 1", price: 100 });
    expect(result.items[1]).toEqual({ id: "2", name: "Item 2", price: 200 });
    expect(result.total).toBe(300);
  });
});
