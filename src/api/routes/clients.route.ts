import { Router } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";

const clientsRouter = Router();

clientsRouter.post("/", async (req, res) => {
  const facade = ClientAdmFacadeFactory.create();
  const client = await facade.add(req.body);
  res.status(201).json({
    id: client.id,
    name: client.name,
    email: client.email,
    document: client.document,
    address: {
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
    },
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  });
});

export default clientsRouter;
