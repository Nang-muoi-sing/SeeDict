/*
 * 通过表达式获取配置
*/
import _expression from './rule/expression.js';

export function getOptions(text){
    for(const item of _expression){
        const match = text.match(item['exp']);
        if(match){
            return item['opt'](match);
        }
    }
    return {};
};
