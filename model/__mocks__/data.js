const contacts = [
  {
    _id: "6054af1750ef9d1f040c5e40",
    name: "qwer",
    email: "qwer@mail.com",
    phone: "(111) 021-5218",
    owner: "6052057b01e2e30838a79203",
    subscription: "free",
  },
  {
    _id: "6054af6afaf9c94950032516",
    name: "Ewq",
    email: "ewq@mail.com",
    phone: "(321) 555-4567",
    owner: "6052057b01e2e30838a79203",
    subscription: "free",
  },
];

const newContact = {
  name: "New",
  email: "user@mail.com",
  phone: "(000) 000-0000",
  subscription: "free",
};

const User = {
  _id: "6052057b01e2e30838a79203",
  email: "test007@ex.ua",
  password: "$2a$08$HZpWF2tca3u9oFx1E5YBhuBSFevRqnTKbyxs/MLs5FufdoptkKlUO",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNTIwNTdiMDFlMmUzMDgzOGE3OTIwMyIsImlhdCI6MTYxNjIzNjYzNSwiZXhwIjoxNjE2MjQzODM1fQ.Ze-HtaL3g0sZRdlqamzSQKCvj9C5oe-nF8NPNlb6yYY",
  subscription: "premium",
  avatarURL:
    "https://s.gravatar.com/avatar/d6ac26ce64657b23fce03f68f65dc6b4?s=250",
};

const users = [];
users[0] = User;

const newUser = { email: "test@test.com", password: "123456" };

module.exports = { contacts, newContact, User, users, newUser };
