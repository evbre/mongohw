var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    datetime: {
    	type:Date,
    	default:Date.now
    },
    title: String,
    body: String,
    items: [{
    	body: String,
        imgurl: String,
    	item: String,
    	datetime: {
    		type:Date,
    		default:Date.now
    	}		
    }]
    
});

var Post = mongoose.model('Post', postSchema);
module.exports = Post;