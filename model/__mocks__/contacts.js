const { contacts } = require("./data");

const listContacts = jest.fn(
  (userId, { sortBy, sortByDesc, filter, limit = "20", page = "1" }) => {
    return { contacts, total: contacts.length, limit, page };
  }
);

const getContactById = jest.fn((contactId) => {
  const [contact] = contacts.filter(
    (el) => String(el._id) === String(contactId)
  );
  return contact;
});

const addContact = jest.fn((body) => {
  const newContact = { ...body, _id: "6054af1750ef9d1f040c5e42" };
  contacts.push(newContact);
  return newContact;
});

const updateContact = jest.fn((contactId, body) => {
  let [contact] = contacts.filter((el) => String(el._id) === String(contactId));

  if (contact) {
    contact = { ...contact, ...body };
  }
  return contact;
});

const removeContact = jest.fn((contactId) => {
  const index = contacts.findIndex(
    (el) => String(el._id) === String(contactId)
  );
  if (index === -1) {
    return null;
  }
  const [contact] = contacts.splice(index, 1);
  return contact;
});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
