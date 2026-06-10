import { Router } from "express";
import CheckoutFacadeFactory from "../../modules/checkout/factory/checkout.facade.factory";

const checkoutRouter = Router();

checkoutRouter.post("/", async (req, res) => {
  const facade = CheckoutFacadeFactory.create();
  const result = await facade.placeOrder(req.body);
  res.status(200).json(result);
});

export default checkoutRouter;
