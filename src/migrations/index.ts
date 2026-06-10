import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { up as up01, down as down01 } from "./01-create-adm-products.migration";
import { up as up02, down as down02 } from "./02-create-store-catalog-products.migration";
import { up as up03, down as down03 } from "./03-create-clients.migration";
import { up as up04, down as down04 } from "./04-create-transactions.migration";
import { up as up05, down as down05 } from "./05-create-invoices.migration";

export const migrator = (sequelize: Sequelize) => {
  return new Umzug({
    migrations: [
      { name: "01-create-adm-products", up: up01, down: down01 },
      { name: "02-create-store-catalog-products", up: up02, down: down02 },
      { name: "03-create-clients", up: up03, down: down03 },
      { name: "04-create-transactions", up: up04, down: down04 },
      { name: "05-create-invoices", up: up05, down: down05 },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: undefined,
  });
};

export type Migration = typeof migrator extends (sequelize: Sequelize) => Umzug<infer Ctx> ? Ctx : never;
