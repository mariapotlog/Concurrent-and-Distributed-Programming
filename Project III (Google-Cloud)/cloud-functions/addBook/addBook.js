const { Datastore } = require("@google-cloud/datastore");
const uuid = require("uuid");

const projectId = "bold-site-313918";
const keyFilename = "bold-site-313918-b2bb435a253f.json";

const datastore = new Datastore({ projectId, keyFilename });

const kind = "Book";

exports.addBook = (req, res) => {
  const { name, author } = req.query;
  const id = uuid.v4();
  const key = datastore.key([kind, id]);
  const data = { id, name, author };
  const book = { key, data };

  datastore
    .save(book)
    .then(() => {
      console.log(`Saved ${book.key.name}: ${book.data.author}`);
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
};
