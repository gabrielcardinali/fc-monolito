import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "../usecase/place-order/place-order.dto";
import CheckoutFacadeInterface from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

  placeOrder(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    return this.placeOrderUseCase.execute(input);
  }
}
