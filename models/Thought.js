const { Schema, model } = require('mongoose');


const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
};

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
           
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date) => formatTimestamp(date)
        }
    },
    
    {id : false}
);

const thoughtSchema = new Schema({
    
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        get: (date) => formatTimestamp(date),
    },

    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],

},
{
    toJSON: {
        virtuals: true 
    },
    id: true
});




thoughtSchema
.virtual('reactionCount')
.get(function () { return this.reactions.length });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
