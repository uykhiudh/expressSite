var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function () {
    setup(function () {
        browser = new Browser();
    });
    /*test('requesting a group rate quote from the hood riber tour page' +
        'should populate the referrer field', function (done) {
        var referrer = 'http://localhost:3000/tours/hood-river';
        browser.visit(referrer, function () {
            browser.clickLink('.requestGroupRate', function () {
                console.log('我打印的：');
                // 为啥获取不到值我也是不知道
                console.log(browser.field('referrer').value);
                console.log(browser.querySelector('form').innerHTML);
                console.log('我打印的结束');
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });*/

    /*test('222requesting agroup rate from the oregon coast tour page should ' +
        'populate the referrer field', function (done) {
        var referrer = 'http://localhost:3000/tours/oregon-coast';
        browser.visit(referrer, function () {
            browser.clickLink('requestGroupRate', function () {
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });*/
    test('visiting the "request group rate" page dirctly should result ' +
        'in an empty referrer field', function (done) {
        browser.visit('http://localhost:3000/tours/request-group-rate', function () {
            assert(browser.field('referrer').value === '');
            done();
        });
    });

    /**
     * 命令：断言命令
     * mocha -u tdd -R spec qa/tests-crosspage.js 2>/dev/null
     */
});