import { Router } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

const invoiceRouter = Router();

invoiceRouter.get("/:id", async (req, res) => {
  const facade = InvoiceFacadeFactory.create();
  const result = await facade.find({ id: req.params.id });
  res.status(200).json(result);
});

export default invoiceRouter;
