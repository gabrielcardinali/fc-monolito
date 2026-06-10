import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacade {
    const clientAdmFacade = ClientAdmFacadeFactory.create();
    const productAdmFacade = ProductAdmFacadeFactory.create();
    const storeCatalogFacade = StoreCatalogFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const checkoutRepository = new CheckoutRepository();

    const useCase = new PlaceOrderUseCase(
      clientAdmFacade,
      productAdmFacade,
      storeCatalogFacade,
      paymentFacade,
      invoiceFacade,
      checkoutRepository
    );

    return new CheckoutFacade(useCase);
  }
}
