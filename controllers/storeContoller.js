const mongoose = require("mongoose");
// we will use the singelton property of mongoose to get the store.
const Store = mongoose.model("Store");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/");
    if (isPhoto) {
      next(null, true);
    } else {
      next(
        {
          message: `That filetype isn\'t allowed!`
        },
        false
      );
    }
  }
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", {
    title: "Add Store"
  });
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware.
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

// Adding the keyword async tells the browser that the function that I AM writing is gowing to have some
//awaits in it.
exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash(
    "success",
    `Successfully created ${store.name}. Care to leave a review`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // query the database to get a list of all the available stores.
  const stores = await Store.find();
  // console.log(stores);
  res.render("stores", { title: "Stores", stores });
};

exports.editStore = async (req, res) => {
  // find the store using the ID.
  const store = await Store.findOne({ _id: req.params.id });
  // confirm if the user is the owner of the store. TODO:
  // render out the edit form.
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // Set the store location to be a point.
  req.body.location.type = "Point";
  //Find and update the store.
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash(
    "success",
    `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${
      store.slug
    }"> View Store -></a>`
  );
  //redirect to say that the store was successfully updated.
  res.redirect(`/stores/${store._id}/edit`);
};

/* Getting the store by slug */
exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    return next();
  }
  res.render('store', {store , title: store.name})
};

//Getting stores by tags.
exports.getStoresByTag = async (req,res) =>{
 const tags = await Store.getTagsList();
 const tag = req.params.tag;
res.render('tag', {tags, title:"Tags", tag} )

}