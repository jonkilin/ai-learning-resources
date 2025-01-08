import mongoose, { Document, Schema } from 'mongoose';

interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
}

interface IResource extends Document {
  title: string;
  description: string;
  type: 'course' | 'book' | 'paper' | 'tool';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  tags: string[];
  ratings: number[];
  comments: IComment[];
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    type: {
      type: String,
      required: true,
      enum: ['course', 'book', 'paper', 'tool']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (tags: string[]) => tags.length <= 5,
        message: 'Cannot have more than 5 tags'
      }
    },
    ratings: {
      type: [Number],
      default: [],
      validate: {
        validator: (ratings: number[]) => ratings.every(r => r >= 1 && r <= 5),
        message: 'Ratings must be between 1 and 5'
      }
    },
    comments: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
