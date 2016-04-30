var express = require('express');
var app = express();
//set port
app.set('port', process.env.PORT || 3000);

// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set up the public directory to serve static files
app.use(express.static(__dirname + '/public'));

//body parser -- for form processing
app.use(require('body-parser').urlencoded({extended:true}));

// bring in db credentials
var credentials = require('./credentials.js');

// mongoose
var mongoose = require('mongoose');
mongoose.connect(credentials.mongo);

// model
var Post = require('./models/post.js');

// ------ routes -------- //

/*app.get('/populate',function(req,res){
	new Message({
		username: 'robyn',
		title: 'Hello',
		body: 'Hello from the outside'
	}).save(function(err){
		if (err){ console.log(err); }
		res.send('saved');
	});
});*/
// show all the top-level (parent) messages
app.get('/',function(req,res){
	Post.find({}).sort({datetime:-1}).exec(function(err,posts){
		var context = {posts:posts};
		res.render('index',context);
	});
	//Room.find({}).sort({date: -1}).exec(function(err, docs) { ... });
	
});

app.get('/all',function(req,res){
	Post.find(function(err,posts){
		res.json(posts);
	});
})

app.get('/new',function(req,res){
	res.render('post_form');
});

// show a thread
app.get('/list/:id',function(req, res){
	Post.findById(req.params.id, function (err, doc){
		//var context = {messages: doc};
		res.render('list',doc);
	});
});

// 
// add new thread
app.post('/post',function(req, res){
	new Post({
		title: req.body.title,
		body: req.body.postbody
	}).save(function(err){
		if (err){ console.log(err); }
		//res.send('saved');
		res.redirect('/');
	});
});

// add reply to existing thread
app.post('/post/:parentId',function(req, res){
	var obj = {};
	obj.body = req.body.postbody;
	obj.item = req.body.item;
	obj.imgurl = req.body.imgurl; 
	Post.findById(req.params.parentId, function (err, doc){
		if (err){
			console.log(err);
			res.render('500');
		}
	  	doc.items.push(obj);
	  	doc.save();
	  	//res.send("Saved reply");
	  	res.redirect('/list/'+req.params.parentId);
	});
});

// 404
app.use(function (req,res,next) {
	res.status(404);
	res.render('404');
});

// 500
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

// listen
app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});