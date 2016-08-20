const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const DocumentSchema = new Schema({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Title is required'],
    maxlength: [100, 'Title is too long'],
  },
  content: {
    type: String,
    trim: true,
    required: [true, 'Content is required'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Role is required'],
  },
  access: {
    read: {
      type: String,
      required: true,
      default: 'public',
      enum: ['private', 'authenticated', 'public'],
    },
    write: {
      type: String,
      required: true,
      default: 'private',
      enum: ['private', 'authenticated'],
    },
  },
}, {
  timestamps: true,
});

DocumentSchema.plugin(deepPopulate, {
  populate: {
    'owner.role': { select: '-_id' },
  },
});

module.exports = mongoose.model('Document', DocumentSchema);
