import mongoose from 'mongoose';

const learnModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    code_blocks: {
        type: [String],
        default: []
    },
    content: {
        type: "string", //will be a markdown string
        required: true
    },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.every(url => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(url));
            },
            message: props => `One or more image URLs are not supported image files!`
        }
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
    }
});

export const learnModule = mongoose.model('LearnModule', learnModuleSchema, 'learn_content');
