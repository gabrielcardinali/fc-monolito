import { DataTypes, QueryInterface } from "sequelize";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.createTable("order_items", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "orders", key: "id" },
    },
    product_id: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    sales_price: { type: DataTypes.FLOAT, allowNull: false },
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.dropTable("order_items");
};
