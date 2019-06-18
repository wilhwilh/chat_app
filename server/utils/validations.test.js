const exprect = require('expect');

const {isRealString} = require('./isRealString');

describe('is Real String', () => {
    it('should reject non-string values', () =>{
        let res = isRealString(65);
        exprect(res).toBe(false);
    });

    it('should reject non-string with only spaces', () =>{
        let res = isRealString('           ');
        exprect(res).toBe(false);
    });

    it('should allow string with non-space chars.', () =>{
        let res = isRealString('    WIL           ');
        exprect(res).toBe(true);
    });

});