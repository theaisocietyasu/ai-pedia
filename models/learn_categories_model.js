import mongoose from 'mongoose';

const learnCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Allow URLs or file names ending with allowed extensions
                return /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a supported image file!`
        }
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('LearnCategory', learnCategorySchema, 'learn_categories');