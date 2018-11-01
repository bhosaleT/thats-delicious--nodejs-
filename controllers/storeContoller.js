const mongoose = require("mongoose");
// we will use the singelton property of mongoose to get the store.
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", {
    title: "Add Store"
  });
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
    //TODO:
    //Find and update the store.
    const store = await Store.findOneAndUpdate({_id : req.params.id}, req.body , {
        new: true,
        runValidators: true,
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}"> View Store -></a>` )
    //redirect to say that the store was successfully updated.
    res.redirect(`/stores/${store._id}/edit`);

}