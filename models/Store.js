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
    created: {
        type: Date,
        default: Date.now()
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: "You must supply coordinates"
        }],
        address: {
            type: String,
            required: "You must supply an address"
        }
    }
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