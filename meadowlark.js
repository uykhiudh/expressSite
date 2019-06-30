var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars')
    .create({
        defaultLayout:'main',
        helpers:{
            section:function (name, options) {
                if (!this._sections) {
                    this._sections = {};
                }
                this._sections[name] = options.fn(this);
                return null;
            }
        }
        /*,extname:'.hbs'*/
    });

var fortune = require('./lib/fortune');


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');


app.set('port', process.env.RORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function (req,res,next){
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});


// 获取当前天气数据
function getWeatherData(){
    return {
        locations:[
            {
                name:'Portland',
                forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl:'https://icons.wxug.com/i/c/v4/29.svg',
                weather:'Overcast',
                temp:'54.1 F (12.3 C)'
            },
            {
                name:'Bend',
                forecastUrl:'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl:'https://icons.wxug.com/i/c/v4/32.svg',
                weather:'Partly Cloudy',
                temp:'55.1 F (12.8 C)'
            },
            {
                name:'Manzanita',
                forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl:'https://icons.wxug.com/i/c/v4/34.svg',
                weather:'Light Rain',
                temp:'55.0 F (12.8 C)'
            }
        ]
    }
}

app.use(function (req, res, next) {
    // res.locals 是每一个布局的数据
    if(!res.locals.partials){
        res.locals.partials = {};
    }
    // partials下面参数名字不能与局部文件的名字一样
    // res.locals.partials.weather = getWeatherData();
    res.locals.partials.weatherData = getWeatherData();
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

// 段落section
app.get('/jquerytest',function (req, res) {
    res.render('jquerytest');
});

// 客户端handlebars
app.get('/nursery-rhyme',function (req, res) {
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme',function (req, res) {
    res.json({
        animal:'squirrel',
        bodyPart:'tail',
        adjective:'bushy',
        noun:'heck'
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

app.get('/product-list',function (rea, res) {
    res.render('product-list',{
        currency:{
            name:'United States dollars',
            abbrev:'USD'
        },
        tours:[
            {
                name:'Hood River',
                price:'$99.95'
            },
            {
                name:'Oregon Coast',
                price:'$159.95'
            }
        ],
        specialsUrl:'/january-specials',
        currencies:['USD','GBP','BTC']
    });
});

// lauout 没有布局文件
app.get('/no-layout',function (req, res) {
    res.render('no-layout',{
        layout:null
    });
});

app.get('/test',function (req, res) {
    res.type('text/plain').send('this is a test');
});

app.get('/foo',function (res, res) {
    res.render('foo',{
        // 不用默认的布局了 lauout为null的时候不使用布局
        // layout:null
        layout:'microsite'
    });
});


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

