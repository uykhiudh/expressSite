var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars')
    .create({defaultLayout:'main'});

var fortune = require('./lib/fortune');


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');


app.set('port', process.env.RORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function (req,res,next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.favicon(__dirname+'/public/img/favicon.ico'));

app.get('/',function (req, res) {
	res.render('home');
});

app.get('/about',function (req, res) {
    res.render('about',{
        fortune:fortune.getFortune(),
        pageTestScript:'/qa/tests-about.js'
    });
});

app.get('/tours/hood-river',function (req,res){
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate',function (req,res){
    res.render('tours/request-group-rate');
});

// 打印请求头
app.get('/headers',function (req, res) {
    res.set('Content-Type','text/plain');
    var s = '';
    for (var name in req.headers) {
        s += name + ': ' + req.headers[name] + '\n';
    }
    res.send(s);
});

// 将上下文传递给视图，包括查询字符串、cookie和session值
app.get('/greeting',function (req, res) {
    res.render('about', {
        message:'Welcome',
        style: req.query.style,
        userid: req.cookie && req.cookie.userid,
        username: req.session && req.session.username
    });
});

app.post('/process-contact',function (req, res) {
    console.log(req.body);
    console.log('Received contact from ' + req.body.name + ' <' + req.body.email + '>');
    // res.redirect(303,'/thank-you');
    try {
        return res.xhr?res.json({success:true}):res.redirect(303,'/thank-you');
    }catch (e) {
        return res.xhr?res.json({error:'Database error'}):res.redirect(303,'/error');
    }
});

app.get('/thank-you',function (req, res) {
    res.type('text/plain').send('收到请求了');
    // res.render('thank-you');
});

// lauout 没有布局文件
app.get('/no-layout',function (req, res) {
    res.render('no-layout',{
        layout:null
    });
});

app.get('/test',function (req, res) {
    res.type('text/plain').send('this is a test');
})

// 200以外的响应吗
app.get('/error',function (req, res) {
    // res.status(500);
    // res.render('error');
    // 可以连写
    res.status(500).render('error');
});

// 定制404页面
app.use(function (req, res) {
    res.status(404).render('404');
});



// 定制500页面
/*app.use(function (err,req,res,next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});*/



/**
 * 添加错误处理程序
 * 这应该出现在所有路由方法的结尾
 * 需要注意的是，即使你不需要一个'下一步'防范
 * 他也必须包含，以便Express将它识别为一个错误处理程序
 */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('error');
});

app.listen(app.get('port'),function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl - C to terminate.');
});

