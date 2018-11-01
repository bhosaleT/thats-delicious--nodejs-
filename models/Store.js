const mongoose = require('mongoose');
//we set the promise in mongoose to the es6 async await promise.
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Please enter a store name"
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
});


storeSchema.pre('save', function (next) {
    //we only want this to run when the stores name is changed.
    if (!this.isModified('name')) {
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
    // TODO make more detailed to make slugs UNIQUE.
});

module.exports = mongoose.model('Store', storeSchema);