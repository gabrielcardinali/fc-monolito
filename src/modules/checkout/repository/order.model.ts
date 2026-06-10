import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import OrderItemModel from "./order-item.model";

@Table({ tableName: "orders", timestamps: false })
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false, field: "client_id" })
  declare clientId: string;

  @Column({ allowNull: false })
  declare status: string;

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[];
}
