import { Router } from "express";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";

const productsRouter = Router();

productsRouter.post("/", async (req, res) => {
  const facade = ProductAdmFacadeFactory.create();
  const product = await facade.addProduct(req.body);
  await StoreCatalogProductModel.create({
    id: product.id,
    name: product.name,
    description: product.description,
    salesPrice: req.body.salesPrice,
  });

  res.status(201).json({
    id: product.id,
    name: product.name,
    description: product.description,
    purchasePrice: product.purchasePrice,
    salesPrice: req.body.salesPrice,
    stock: product.stock,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
});

export default productsRouter;
