const mongoose = require('mongoose');

const uri = "mongodb+srv://gopsettu3011:Gopi2004@secondmediumcluster.dsgewtu.mongodb.net/?retryWrites=true&w=majority&appName=secondMediumCluster";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(uri, clientOptions).then(() => {
  console.log("MongoDB connected!");
}).catch((err) => {
  console.error("Error connecting to MongoDB: ", err);
});
