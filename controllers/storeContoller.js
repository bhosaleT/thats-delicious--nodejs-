const mongoose = require('mongoose');
// we will use the singelton property of mongoose to get the store.
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', {
        title: 'Add Store'
    });
}
// Adding the keyword async tells the browser that the function that I AM writing is gowing to have some
//awaits in it.
exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review`);
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req,res) => {
    // query the database to get a list of all the available stores.
    const stores = await Store.find();
    // console.log(stores);
    res.render('stores', { title: 'Stores', stores});
}