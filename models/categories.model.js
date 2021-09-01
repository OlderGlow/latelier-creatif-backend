const mongoosePaginate = require('mongoose-paginate-v2');
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        title: String,
        image: String,
        description: String,
        categorie: String,
        published: Boolean,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
    schema.plugin(mongoosePaginate);
    const categorieDb = mongoose.model("Categories", schema);
    return categorieDb;

  };