const mongoose = require("mongoose");
//we set the promise in mongoose to the es6 async await promise.
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema(
  {
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
        default: "Point"
      },
      coordinates: [
        {
          type: Number,
          required: "You must supply coordinates"
        }
      ],
      address: {
        type: String,
        required: "You must supply an address"
      }
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must supply an author"
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* Defining our indexes */
storeSchema.index({
  name: "text",
  description: "text"
});

storeSchema.index({
  location: "2dsphere"
});

storeSchema.pre("save", async function(next) {
  //we only want this to run when the stores name is changed.
  if (!this.isModified("name")) {
    next();
    return;
  }
  this.slug = slug(this.name);
  // find othere stores that have a slug of new, new-1, new-2.
  // we  are looking for a slug that starts with slug and ends with - or numbers 0-9
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more detailed to make slugs UNIQUE.
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    // lookup stores and populate their reviews
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "store",
        as: "reviews"
      }
    },

    // filter for only items that have 2 or more reviews

    { $match: { "reviews.1": { $exists: true } } },

    // add the average reviews field
    {
      $project: {
        photo: `$$ROOT.photo`,
        name: `$$ROOT.name`,
        reviews: `$$ROOT.reviews`,
        sulg: `$$ROOT.slug`,
        averageRating: { $avg: "$reviews.rating" }
      }
    },
    // sort it by our new fieldm highest review first
     {
       $sort: {averageRating: -1}
     },
    // limit to at most 10
    {
      $limit : 10
    }
  ]);
};

/* Find reviews where the stores._Id === reviews store property */

storeSchema.virtual("reviews", {
  ref: "Review", //what model to link
  localField: "_id", //which field on the stores
  foreignField: "store" // which field on the review
});


function autopopulate(next){
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model("Store", storeSchema);
