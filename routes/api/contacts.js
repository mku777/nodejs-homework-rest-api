const express = require("express");
const Joi = require("joi");
const { uuid } = require("uuidv4");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

const joiValidate = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  phone: Joi.string().min(5).max(15).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    return res.status(200).json({
      data: contacts,
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    return res.status(200).json({
      contact,
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const validationDataReq = joiValidate.validate(req.body);
    if (validationDataReq.error) {
      const [errorLable] = validationDataReq.error.details;
      return res.status(400).json({
        message: `missing required ${errorLable.context.label} field`,
      });
    }

    const newContact = {
      id: uuid(),
      name,
      email,
      phone: String(phone),
    };

    const addedContact = await addContact(newContact);

    return res.status(201).json({
      addedContact,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const removedContact = await removeContact(contactId);
    if (!removedContact) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    return res.json({ message: "contact deleted" });
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;

  const validationDataReq = joiValidate.validate(req.body);
  if (validationDataReq.error) {
    return res.status(400).json({
      message: `missing fields`,
    });
  }
  try {
    const updatedContact = await updateContact(contactId, req.body);
    if (!updatedContact) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.status(200).json({
      updatedContact,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
