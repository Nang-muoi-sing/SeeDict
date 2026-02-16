'use strict';
var test = require('tape');
var relationship = require('..');

test('[call]', function (t) {
    // console.log('[test]',relationship({text:'爸爸的妈妈的姐姐的儿子'}));

    t.deepEqual(relationship({text:'爸爸的哥哥的弟弟的儿子'}),['堂哥','堂弟','哥哥','弟弟','自己']);
    t.deepEqual(relationship({text:'爸爸的妹妹的女儿的老公'}),['姑表姐夫','姑表妹夫']);
    t.deepEqual(relationship({text:'表姐的哥哥',sex:1}),['姑表哥','舅表哥']);
    t.deepEqual(relationship({text:'表姐的妹妹',sex:1}),['姑表姐','姑表妹','舅表姐','舅表妹']);
    t.deepEqual(relationship({text:'弟弟的表哥',sex:1}),['姑表哥','姑表弟','舅表哥','舅表弟']);
    t.deepEqual(relationship({text:'姐姐的老公的姐姐的老公'}),['姊妹姻姊妹壻']);
    t.deepEqual(relationship({text:'哥哥的弟弟的爸爸的儿子',sex:1}),['哥哥','弟弟','自己']);
    t.deepEqual(relationship({text:'爱人',sex:1}),['老婆']);
    t.deepEqual(relationship({text:'爱人的爱人',sex:1}),['自己']);
    t.deepEqual(relationship({text:'老婆的爱人',sex:1}),['自己']);
    t.deepEqual(relationship({text:'老婆的老公',sex:1}),['自己']);
    t.deepEqual(relationship({text:'老婆的外孙的姥爷',sex:1}),['自己']);
    t.deepEqual(relationship({text:'老公的老婆的儿子的爸爸',sex:0}),['老公']);
    t.deepEqual(relationship({text:'堂兄弟的孩子',sex:1}),['堂侄','堂侄女']);
    t.deepEqual(relationship({text:'儿子的爸爸的妈妈',sex:1}),['妈妈']);
    t.deepEqual(relationship({text:'岳母的配偶的孩子的爸爸'}),['岳父']);
    t.deepEqual(relationship({text:'爸爸的妈妈的姐姐的儿子'}),['姨伯父','姨叔父']);
    t.end();
});
test('[target]', function (t) {
    t.deepEqual(relationship({text:'我',target:'爸爸'}),['儿子','女儿']);
    t.deepEqual(relationship({text:'老公的父母',target:'孩子'}),['爷爷','奶奶']);
    t.deepEqual(relationship({text:'爱人',target:'娘家侄子'}),['姑丈']);
    t.end();
});
test('[reverse]', function (t) {
    t.deepEqual(relationship({text:'爸爸的舅舅',sex:0,reverse:true}),['甥孙女']);
    t.deepEqual(relationship({text:'岳母',target:'女儿',reverse:true}),['外孙女']);
    t.deepEqual(relationship({text:'姑妈',target:'舅妈',reverse:true}),['兄弟眷兄弟妇']);
    t.deepEqual(relationship({text:'舅妈',target:'女儿',reverse:true}),['姑甥孙女','姑甥外孙女']);
    t.deepEqual(relationship({text:'外婆',target:'女婿',reverse:true}),['外曾孙女婿','外曾外孙女婿']);
    t.end();
});
test('[filter]', function (t) {
    t.deepEqual(relationship({text:'内侄'}),['舅侄','舅侄女']);
    t.end();
});
test('[type:chain]', function (t) {
    t.deepEqual(relationship({text:'舅爷爷',type:'chain'}),['爸爸的妈妈的兄弟']);
    t.deepEqual(relationship({text:'妻儿',type:'chain'}),['老婆','儿子','女儿']);
    t.deepEqual(relationship({text:'父母',target:'老公',type:'chain'}),['老婆的爸爸','老婆的妈妈']);
    t.end();
});
test('[type:pair]', function (t) {
    t.deepEqual(relationship({text:'舅妈',target:'哥哥',type:'pair'}),['舅甥']);
    t.deepEqual(relationship({text:'舅妈',target:'外婆',type:'pair'}),['婆媳']);
    t.deepEqual(relationship({text:'舅妈',target:'二舅',type:'pair'}),['伯媳','叔嫂','夫妻']);
    t.deepEqual(relationship({text:'堂哥',target:'叔叔',type:'pair'}),['伯侄', '叔侄', '父子']);
    t.end();
});
test('[age]', function (t) {
    t.deepEqual(relationship({text:'妈妈的二哥'}),['二舅']);
    t.deepEqual(relationship({text:'爸爸的二哥'}),['二伯']);
    t.deepEqual(relationship({text:'二舅妈',target:'三舅'}),['二嫂']);
    t.deepEqual(relationship({text:'爸爸的二爸'}),['二爷爷']);
    t.deepEqual(relationship({text:'姑姑',target:'叔叔',optimal:true}),['姐姐','妹妹']);
    t.deepEqual(relationship({text:'大舅',target:'二舅的儿子'}),['伯父']);
    t.deepEqual(relationship({text:'二舅妈',target:'二舅',type:'pair'}),['夫妻']);
    t.deepEqual(relationship({text:'二舅妈',target:'大舅',type:'pair'}),['伯媳']);
    t.end();
});
test('[expression]', function (t) {
    t.deepEqual(relationship('外婆和奶奶之间是什么关系？'),['儿女亲家']);
    t.deepEqual(relationship('妈妈应该如何称呼姑姑'),['姑子']);
    t.deepEqual(relationship('姑奶奶是什么关系'),['爸爸的爸爸的姐妹']);
    t.deepEqual(relationship('姑奶奶和爸爸是什么关系'),['姑侄']);
    t.deepEqual(relationship('我应该叫外婆的哥哥什么？'),['舅外公']);
    t.deepEqual(relationship('七舅姥爷应该叫我什么？'),['甥外孙','甥外孙女']);
    t.deepEqual(relationship('舅公是什么关系？'),['爸爸的妈妈的兄弟', '妈妈的妈妈的兄弟', '老公的妈妈的兄弟']);
    t.deepEqual(relationship('舅妈如何称呼外婆？'),['婆婆']);
    t.deepEqual(relationship('外婆和奶奶之间是什么关系？'),['儿女亲家']);
    t.end();
});
