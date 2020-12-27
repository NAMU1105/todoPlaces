const fs = require("fs");
const path = require("path");

const express = require("express");
const port = process.env.PORT || 5001;
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-errors");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
// 외부로부터의 uploads/images폴더 접근이 가능하도록 하는 코드
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// app.get("/", (req, res) => res.send("hello world"));

// cors에러 해결
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// basic routings
// app.use(placesRoutes);
app.use("/api/places", placesRoutes); // => /api/places...
app.use("/api/users", usersRoutes);

// basic error handling
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  // 에러가 발생할 경우 해당 이미지 업로드를 롤백시키는 코드
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// 1. 몽고디비(몽구스) 연결
mongoose
  .connect("mongodb://localhost:27017/todoPlacesDB?retryWrites=false", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening at ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://namu:gottkf2011@cluster0.fsmfl.mongodb.net/<dbname>?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// mongoose
//   .connect(
//     "mongodb+srv://namu:gottkf2011@cluster0.fsmfl.mongodb.net/todoPlaces?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`app listening at ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.listen(port, () => {
//     console.log(`app listening at ${port}`);
//   });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error:"));
db.once("open", function () {
  console.log("mongoose is connected!");
});
