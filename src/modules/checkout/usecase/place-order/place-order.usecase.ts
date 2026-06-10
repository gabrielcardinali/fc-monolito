import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Order from "../../domain/order.entity";
import OrderItem from "../../domain/order-item.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase {
  constructor(
    private clientAdmFacade: ClientAdmFacadeInterface,
    private productAdmFacade: ProductAdmFacadeInterface,
    private storeCatalogFacade: StoreCatalogFacadeInterface,
    private paymentFacade: PaymentFacadeInterface,
    private invoiceFacade: InvoiceFacadeInterface,
    private checkoutRepository: CheckoutGateway
  ) {}

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this.clientAdmFacade.find({ id: input.clientId });

    await Promise.all(
      input.products.map(async ({ productId }) => {
        const stock = await this.productAdmFacade.checkStock({ productId });
        if (stock.stock === 0) throw new Error(`Product ${productId} is out of stock`);
      })
    );

    const items = await Promise.all(
      input.products.map(async ({ productId }) => {
        const product = await this.storeCatalogFacade.find({ id: productId });
        return new OrderItem({
          id: new Id(),
          productId,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        });
      })
    );

    const order = new Order({ clientId: input.clientId, items });

    const transaction = await this.paymentFacade.process({
      orderId: order.id.id,
      amount: order.total(),
    });

    let invoiceId = "";
    if (transaction.status === "approved") {
      const invoice = await this.invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: items.map((i) => ({ id: i.productId, name: i.name, price: i.salesPrice })),
      });
      invoiceId = invoice.id;
      order.approve();
    }

    await this.checkoutRepository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId,
      status: order.status,
      total: order.total(),
      products: input.products,
    };
  }
}
