import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoice-items.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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
  generate: jest.fn(),
  find: jest.fn().mockResolvedValue(invoice),
});

describe("FindInvoiceUseCase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const result = await usecase.execute({ id: "1" });

    expect(repository.find).toHaveBeenCalledWith("1");
    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123456789");
    expect(result.address).toEqual({
      street: "Street 1",
      number: "123",
      complement: "Apt 1",
      city: "City",
      state: "State",
      zipCode: "12345",
    });
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toEqual({ id: "1", name: "Item 1", price: 100 });
    expect(result.items[1]).toEqual({ id: "2", name: "Item 2", price: 200 });
    expect(result.total).toBe(300);
    expect(result.createdAt).toBe(invoice.createdAt);
  });
});
