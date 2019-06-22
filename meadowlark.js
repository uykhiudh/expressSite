var express = require('express');
var app = express();
var handlebars = require('express-handlebars')
	.create({defaultLayout:'main'});


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');


app.set('port', process.env.RORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/',function (req, res) {
	/*res.type('text/plain');
	res.send('Meadowlark Travel');*/
	res.render('home');
});

var fortunes = [
    'Conquer your fears or they will conquer you.',
    'Rivers need springs.',
    'Do not fear what you don\'t know.',
    'You will have a pleasant surprise.',
    'Whenever possible, keep it simple.'
];
app.get('/about',function (req, res) {
	/*res.type('text/plain');
	res.send('About Meadowlark Travel');*/
	// res.render('about');
    var randomsFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
    res.render('about',{fortune:randomsFortune});
});

// 定制404页面
app.use(function (req, res, next) {
	/*res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');*/
	res.status(404);
	res.render('404');
});

// 定制500页面
app.use(function (err,req,res,next) {
	console.error(err.stack);
	/*res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');*/
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'),function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl - C to terminate.');
});

