import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type OrderItemProps = {
  id?: Id;
  productId: string;
  name: string;
  description: string;
  salesPrice: number;
};

export default class OrderItem extends BaseEntity {
  private _productId: string;
  private _name: string;
  private _description: string;
  private _salesPrice: number;

  constructor(props: OrderItemProps) {
    super(props.id);
    this._productId = props.productId;
    this._name = props.name;
    this._description = props.description;
    this._salesPrice = props.salesPrice;
  }

  get productId(): string { return this._productId; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get salesPrice(): number { return this._salesPrice; }
}
