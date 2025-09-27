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

export const learnModule = mongoose.model('LearnModule', learnModuleSchema, 'learn_content');
