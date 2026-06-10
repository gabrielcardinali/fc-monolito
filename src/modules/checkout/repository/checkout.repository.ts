import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import OrderItem from "../domain/order-item.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.clientId,
        status: order.status,
        items: order.items.map((i) => ({
          id: i.id.id,
          productId: i.productId,
          name: i.name,
          description: i.description,
          salesPrice: i.salesPrice,
        })),
      },
      { include: [OrderItemModel] }
    );
  }

  async findOrder(id: string): Promise<Order> {
    const model = await OrderModel.findOne({
      where: { id },
      include: [OrderItemModel],
    });
    if (!model) throw new Error(`Order ${id} not found`);

    return new Order({
      id: new Id(model.id),
      clientId: model.clientId,
      status: model.status as "pending" | "approved",
      items: model.items.map(
        (i) =>
          new OrderItem({
            id: new Id(i.id),
            productId: i.productId,
            name: i.name,
            description: i.description,
            salesPrice: i.salesPrice,
          })
      ),
    });
  }
}
