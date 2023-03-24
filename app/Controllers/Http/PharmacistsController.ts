import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Pharmacist from "App/Models/Pharmacist";
import CreatePharmacistValidator from "App/Validators/CreatePharmacistValidator";
import UpdatePharmacistValidator from "App/Validators/UpdatePharmacistValidator";
import { v4 as uuidV4 } from "uuid";

export default class PharmacistsController {
  public async index({ response }: HttpContextContract) {
    try {
      const data = await Pharmacist.query().preload("employee", (q) =>
        q.select("id", "name", "username", "role", "join_date", "email")
      );

      response.created({ message: "Berhasil mengambil data Apoteker", data });
    } catch (error) {
      response.send({ message: error.message });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreatePharmacistValidator);
      payload["id"] = uuidV4();
      const data = await Pharmacist.create(payload);

      response.created({ message: "Berhasil membuat data apoteker", data });
    } catch (error) {
      response.send({ message: error.message });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const { id } = params;

      const data = await Pharmacist.query()
        .preload("employee", (q) =>
          q.select("id", "name", "username", "role", "join_date", "email")
        )
        .where("id", "=", id);

      response.created({
        message: "Berhasil mengambil data detail apoteker",
        data,
      });
    } catch (error) {
      response.send({ message: error.message });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const { id } = params;
      const payload = await request.validate(UpdatePharmacistValidator);

      const data = await Pharmacist.findByOrFail("id", id);
      await data.merge(payload).save();

      response.created({ message: "Berhasil memperbarui data apoteker", data });
    } catch (error) {
      response.send({ message: error.message });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      const { id } = params;
      const data = await Pharmacist.findByOrFail("id", id);
      await data.delete();

      response.created({message: "Berhasil menghapus data apoteker"})
    } catch (error) {
      response.send({ message: error.message });
    }
  }
}