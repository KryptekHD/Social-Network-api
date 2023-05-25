const { User, Thought } = require('../models');
const mongoose = require('mongoose');

module.exports = {

    getAllThoughts: async (req, res) => {
        try {
            const thought = await Thought.find();

            res.status(200).json(thought);
            
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },
    
    getSingleThought: async (req, res) => {
        try {
            const singThought = await Thought.findOne({ _id: req.params.thoughtId });

            !singThought
                ? res.status(404).json({ error: 'Thought not found' })
                : res.status(200).json(singThought);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    createThought: async (req, res) => {
        try {
            const newThought = await Thought.create(req.body);
            const user = await User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: newThought._id } }, 
                { new: true }
            );

            if(!user){
               return res.status(404).json(error);
            }
                 
            res.status(201).json(newThought);

        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    updateThought: async (req, res) => {
        try {
            const update = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true }
            );

            !update
                ? res.status(404).json(error)
                : res.status(200).json(update);

        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    deleteThought: async (req, res) => {
        try {
            const deleted = await Thought.findByIdAndDelete(req.params.thoughtId);

            if (!deleted) {
                return res.status(404).json(error);
            }
            await User.findByIdAndUpdate(
                deleted.userId,
                { $pull: { thoughts: deleted._id } }
            );

            res.status(200).json({ message: 'your thought was deleted' });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    createReaction: async (req, res) => {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true }
            );
            !thought
                ? res.status(404).json({ error: 'no thought was found' })
                : res.status(201).json(thought);

        } 
        
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    
    },

    
    deleteReaction: async (req, res) => {
        try {
            const { thoughtId } = req.params;
            const { reactionId } = req.body;

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: new mongoose.Types.ObjectId(reactionId) } } },
                { new: true }
            );

            !thought
                ? res.status(404).json({ error: 'your thought was not found' })
                : res.status(200).json(thought);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
};