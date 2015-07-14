/**
 * Created by Administrator on 2015/7/14.
 */

//dependencies


//private fields


//core module to export
module.exports = {
    isValidPath: function(path) {
        path = normalizePath(path);
        if (!isValidPath(path)) {
            return false;
        }
        return path;
    },
    parsePath: function(path) {
        path = normalizePath(path);
        if (!isValidPath(path)) {
            throw new Error('invalid path to be parsed: ', path);
        }

        var result = parsePath(path);
        result.relativeDirectory = isRelativeToRoot(path) ? this.ROOT : this.CWD;

        return result;
    },
    isRelativeToRoot: isRelativeToRoot,
    normalizePath: normalizePath,
    ROOT: 'root',
    CWD: 'cwd'
};

//module initialization


//private functions
function parsePath(path) {
    var reg = /^(?:\/|\.\/)?((\.{2}\/)*)/g;
    var execResult = reg.exec(path);
    var subPathString = path.substr(reg.lastIndex);
    var subPath = [];
    var levels = 0;

    if (execResult[2]) {
        levels = - execResult[1].length / execResult[2].length;
    }

    if (subPathString) {
        subPath = subPathString.split('/');
    }

    return {
        upwardLevels: levels,
        subPath: subPath
    };
}

function normalizePath(path) {
    return (path + '').replace(/(^|\/)(\/*)(\.|\.{3,})?(?=\/)/g, function(match, p1, p2, p3) {
        if (p1) return ''; //case NOT_AT_THE_BEGINNING_OF_THE_LINE
        if (p2) return ''; //case AT_THE_BEGINNING_OF_THE_LINE && STARTS_WITH_SLASH
        if (p3) return '.'; //case AT_THE_BEGINNING_OF_THE_LINE && NOT_STARTS_WITH_SLASH && NON_EMPTY_MATCHED
        return ''; //case AT_THE_BEGINNING_OF_THE_LINE && NOT_STARTS_WITH_SLASH && EMPTY_MATCHED
    });
}

function f(path) {
    console.log(/(^|\/)(\/*)(\.|\.{3,})?(?=\/)/g.exec(path));
    return (path + '').replace(/(^|\/)(\/*)(\.|\.{3,})?(?=\/)/g, function(match, p1, p2, p3) {
        console.log('match: ', match);
        console.log('p1: ', p1);
        console.log('p2: ', p2);
        if (p1) return ''; //case NOT_AT_THE_BEGINNING_OF_THE_LINE
        if (p2) return ''; //case AT_THE_BEGINNING_OF_THE_LINE && STARTS_WITH_SLASH
        if (p3) return '.'; //case AT_THE_BEGINNING_OF_THE_LINE && NOT_STARTS_WITH_SLASH
        return '';
    });
}

function isRelativeToRoot(path) {
    return (path + '')[0] === '/';
}

function isValidPath(path) {
    return (/^(\.{0,2}\/)/).test(path + '');
}