import PlaceOrderUseCase from "./place-order.usecase";
import Address from "../../../@shared/domain/value-object/address";

const mockClientAdmFacade = {
  find: jest.fn().mockResolvedValue({
    id: "client-1",
    name: "Client Name",
    email: "client@email.com",
    document: "123.456.789-00",
    address: new Address("Street 1", "100", "Apt 1", "City", "ST", "12345-000"),
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  add: jest.fn(),
};

const mockProductAdmFacade = {
  checkStock: jest.fn().mockResolvedValue({ productId: "p1", stock: 5 }),
  addProduct: jest.fn(),
};

const mockStoreCatalogFacade = {
  find: jest.fn().mockResolvedValue({
    id: "p1",
    name: "Product 1",
    description: "Desc 1",
    salesPrice: 100,
  }),
  findAll: jest.fn(),
};

const mockPaymentFacade = {
  process: jest.fn(),
};

const mockInvoiceFacade = {
  generate: jest.fn().mockResolvedValue({ id: "invoice-1" }),
  find: jest.fn(),
};

const mockCheckoutRepository = {
  addOrder: jest.fn(),
  findOrder: jest.fn(),
};

const input = {
  clientId: "client-1",
  products: [{ productId: "p1" }],
};

describe("PlaceOrderUseCase unit test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProductAdmFacade.checkStock.mockResolvedValue({ productId: "p1", stock: 5 });
    mockStoreCatalogFacade.find.mockResolvedValue({ id: "p1", name: "Product 1", description: "Desc 1", salesPrice: 100 });
    mockInvoiceFacade.generate.mockResolvedValue({ id: "invoice-1" });
    mockClientAdmFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Client Name",
      email: "client@email.com",
      document: "123.456.789-00",
      address: new Address("Street 1", "100", "Apt 1", "City", "ST", "12345-000"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  const makeUseCase = () =>
    new PlaceOrderUseCase(
      mockClientAdmFacade as any,
      mockProductAdmFacade as any,
      mockStoreCatalogFacade as any,
      mockPaymentFacade as any,
      mockInvoiceFacade as any,
      mockCheckoutRepository as any
    );

  it("should throw error when product is out of stock", async () => {
    mockProductAdmFacade.checkStock.mockResolvedValueOnce({ productId: "p1", stock: 0 });

    await expect(makeUseCase().execute(input)).rejects.toThrow("Product p1 is out of stock");
    expect(mockCheckoutRepository.addOrder).not.toHaveBeenCalled();
  });

  it("should return pending status and empty invoiceId when payment is denied", async () => {
    mockPaymentFacade.process.mockResolvedValueOnce({
      transactionId: "t1",
      orderId: "o1",
      amount: 100,
      status: "declined",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output = await makeUseCase().execute(input);

    expect(output.status).toBe("pending");
    expect(output.invoiceId).toBe("");
    expect(mockInvoiceFacade.generate).not.toHaveBeenCalled();
    expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
  });

  it("should return approved status and invoiceId when payment is approved", async () => {
    mockPaymentFacade.process.mockResolvedValueOnce({
      transactionId: "t1",
      orderId: "o1",
      amount: 100,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output = await makeUseCase().execute(input);

    expect(output.status).toBe("approved");
    expect(output.invoiceId).toBe("invoice-1");
    expect(output.total).toBe(100);
    expect(output.products).toEqual([{ productId: "p1" }]);
    expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
    expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
  });
});
