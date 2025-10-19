import mongoose from 'mongoose';

const learnModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: false, // Optional for backward compatibility with existing documents
        unique: true,
        sparse: true, // Allow multiple null values for documents without slugs
        trim: true
    },
    categories: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: props => `At least one category is required!`
        }
    },
    content: {
        type: "string", //will be a markdown string
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a supported image file!`
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    action_buttons : {
        type: [{
            name: { type: String, required: true },
            link: { type: String, required: true }
        }],
        default: []
    }
});

// Create index on slug for faster lookups
learnModuleSchema.index({ slug: 1 });

export const learnModule = mongoose.model('LearnModule', learnModuleSchema, 'learn_content');
