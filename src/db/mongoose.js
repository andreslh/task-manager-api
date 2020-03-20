const mongoose = require('mongoose');

mongoose.connect(process.env.MONDODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true
});
