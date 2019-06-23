var fortunes = [
    'Conquer your fears or they will conquer you.',
    'Rivers need springs.',
    'Do not fear what you don\'t know.',
    'You will have a pleasant surprise.',
    'Whenever possible, keep it simple.'
];
exports.getFortune = function (){
    var idx = Math.floor(Math.random() * fortunes.length);
    return fortunes[idx];
};


/**
 * 命令：断言命令
 * mocha -u tdd -R spec qa/tests-unit.js
 */