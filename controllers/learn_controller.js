import { mongoConnection } from "../utilities/db_connector";
import { ObjectId } from 'mongodb';
import { learn_categories } from "../models/learn_categories_model";
import { learnModule } from "../models/learn_module";
import dotenv from 'dotenv';
dotenv.config();

const learnCollection = mongoConnection.then(db => db.collection(process.env.LEARN_COLLECTION_NAME || 'learn_content'));

const categories_collection = mongoConnection.then(db => db.collection(process.env.CATEGORIES_COLLECTION_NAME || 'learn_categories'));

export const getAllLearnCategories = async (req, res) => {
    try {
        const categoriesDocs = await (await categories_collection).find({}).toArray();
        // Deserialize using learn_categories schema
        const categories = categoriesDocs.map(doc => new learn_categories(doc));
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLearnContentByCategoryList = async (req, res) => {
    const { category } = req.params;
    try {
        const contentList = await (await learnCollection).find({ categories: { $in: [category] } }).toArray();
        
        // Deserialize using learnModule schema
        const content = contentList.map(doc => new learnModule(doc));

        // filter only relevant fields
        const filteredContent = content.map(item => ({
            _id: item._id,
            title: item.title,
            categories: item.categories,
            thumbnail: item.thumbnail,
            description: item.content.description || ''
        }));

        res.status(200).json(filteredContent);
    } catch (error) {
        console.error('Error fetching content by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLearnContentById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const contentDoc = await (await learnCollection).findOne({ _id: new ObjectId.createFromHexString(id) });
        if (!contentDoc) {
            return res.status(404).json({ error: 'Content not found' });
        }
        // Deserialize using learnModule schema
        const content = new learnModule(contentDoc);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


