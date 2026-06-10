import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderItem from "./order-item.entity";

type OrderProps = {
  id?: Id;
  clientId: string;
  status?: "pending" | "approved";
  items: OrderItem[];
};

export default class Order extends BaseEntity {
  private _clientId: string;
  private _status: "pending" | "approved";
  private _items: OrderItem[];

  constructor(props: OrderProps) {
    super(props.id);
    this._clientId = props.clientId;
    this._status = props.status || "pending";
    this._items = props.items;
  }

  approve(): void { this._status = "approved"; }
  total(): number { return this._items.reduce((sum, i) => sum + i.salesPrice, 0); }

  get clientId(): string { return this._clientId; }
  get status(): string { return this._status; }
  get items(): OrderItem[] { return this._items; }
}
