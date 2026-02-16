/*
 * 缓存数据
*/
import _input from './data/input.js';
import _sort from './data/sort.js';
import {modeData} from './mode.js';

function mergeValues(target, source) {
    Object.entries(source).forEach(([key, value]) => {
        target[key] = (target[key] || []).concat(value);
    });
    return target;
}
let _hash = mergeValues({...modeData }, _input);
_hash = mergeValues(_hash, _sort);

let cacheData = {};
Object.entries(_hash).forEach(([key, names]) => {
    names.forEach((name) => {
        if (!cacheData[name]) {
            cacheData[name] = [];
        }
        cacheData[name].push(key);
    });
});

export {cacheData};