/*
 * 完整关系链数据 - 合并各类关系链数据
*/
import _prefix from './data/prefix.js';
import _branch from './data/branch.js';
import _main from './data/main.js';
import _multipie from './data/multiple.js';

import {expandSelector} from './selector.js';

let _map = { ..._multipie };

// 分支 - 前缀处理
const prefixMap = {};
for(const key in _prefix){
    prefixMap[key] = {};
    for(const selector in _prefix[key]){
        expandSelector(selector).forEach(function(s){
            prefixMap[key][s] = _prefix[key][selector];
        });
    }
}
// 分支 - 节点处理
const branchMap = {};
for(const selector in _branch){
    expandSelector(selector).forEach(function(s){
        branchMap[s] = _branch[selector];
    });
}
// 分支 - 合并
const getMap = function(prefixMap,branchMap){
    const map = {};
    for(const key in branchMap){
        const tag = key.match(/\{.+?\}/)[0];
        const nameList = branchMap[key];
        for(const k in prefixMap[tag]){
            const prefixList = prefixMap[tag][k];
            const newKey = key.replace(tag,k);
            const isFilter = ['h,h','w,w','w,h','h,w'].some(pair=>(newKey.includes(pair)));
            if(!isFilter){
                const newList = prefixList.flatMap((prefix) =>
                    nameList.map((name) => (name.includes('?') ? name.replace('?', prefix) : prefix + name))
                );
                if(!map[newKey]){
                    map[newKey] = _map[newKey]||[];
                }
                map[newKey] = newList.concat(map[newKey]);
            }
        }
    }
    return map;
};
_map = {..._map,...getMap(prefixMap,branchMap)};

// 主要关系
for(let key in _main){
    _map[key] = [..._main[key], ...(_map[key] || [])];
}

// 版权彩蛋
_map['o']=['passer-by.com','\u4f5c\u8005'];

// 配偶关系
const mateMap = {
    'w':['妻','内','岳','岳家','丈人'],
    'h':['夫','外','公','婆家','婆婆'],
};
const nameSet = new Set(Object.values(_map).flat());
for(const key in _map){
    if(key.match(/^[fm]/)||key.match(/^[olx][bs]$|^[olx][bs],[^mf]/)){      // 只对长辈或者兄弟辈匹配
        for(const k in mateMap){
            let newKey = k+','+key;
            if(key.match(/[fm]/)){
                let newKey_x = newKey.replace(/,[ol]([sb])(,[wh])?$/,',x$1$2').replace(/(,[sd])&[ol](,[wh])?$/,'$1$2');
                if(newKey_x!=newKey&&_map[newKey_x]){       // 不扩大解释年龄
                    continue;
                }
            }
            if(!_map[newKey]){
                _map[newKey] = [];
            }
            const prefixList = mateMap[k];
            const nameList = _map[key];
            prefixList.forEach(function(prefix){
                nameList.forEach(function(name){
                    const newName = prefix+name;
                    if(!nameSet.has(newName)){              // 配偶组合的称呼不得与原有称呼冲突(如：妻舅!=妻子的舅舅;外舅公!=老公的舅公)
                        _map[newKey].push(newName);
                    }
                });
            });
        }
    }
}

export default _map;
