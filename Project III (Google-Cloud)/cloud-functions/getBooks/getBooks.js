const { Datastore } = require("@google-cloud/datastore");

const projectId = "bold-site-313918";
const keyFilename = "bold-site-313918-b2bb435a253f.json";

const datastore = new Datastore({ projectId, keyFilename });

const kind = "Book";

const getBooks = async () => {
  const query = datastore.createQuery(kind);
  return datastore.runQuery(query);
};

exports.getBooks = async (req, res) => {
  const [entities] = await getBooks();
  return res.json(entities);
};
