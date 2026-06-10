import { DataTypes, QueryInterface } from "sequelize";

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.createTable("orders", {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    client_id: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.dropTable("orders");
};
