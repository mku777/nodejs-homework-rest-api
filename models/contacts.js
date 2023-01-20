const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (err) {
    console.log(err.message);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const [contact] = contacts.filter(
      (contact) => contact.id === String(contactId)
    );
    if (!contact) {
      throw new Error(404, "Contact not found");
    }
    return contact;
  } catch (err) {
    console.log(err.message);
  }
};

const removeContact = async (id) => {
  try {
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === String(id)
    );
    if (contactIndex === -1) {
      throw new Error("Contact not found");
    }

    const [removedContact] = contacts.splice(contactIndex, 1);
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (error) {
    console.log(error.message);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();
    contacts.push(body);
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return body;
  } catch (err) {
    console.log(err.message);
  }
};

const updateContact = async (id, body) => {
  const { name, email, phone } = body;
  try {
    const contacts = await listContacts();

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === String(id)
    );
    if (contactIndex === -1) {
      throw new Error("Contact not found");
    }

    contacts[contactIndex] = { id, name, email, phone };

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[contactIndex];
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
