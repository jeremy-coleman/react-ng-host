import { compile, PathFunction, pathToRegexp } from './path-to-regexp';
import { IPathTemplateOptions, IPathTestResult } from './types';

class PathTemplate {
    
    private _text: string;
    private _keys: any[] = [];
    private _re : RegExp;
    private _pf : PathFunction;
    
    constructor(text : string, opts?: IPathTemplateOptions) {
        this._text = text;
        this._re = pathToRegexp(text, this._keys, opts);
    }
    
    get text() {
        return this._text;
    }
    
    get paramNames() : string[] {
        return this._keys.map(k => k.name);
    }
    
    get paramCount() {
        return this._keys.length;
    }
    
    test(path : string) : IPathTestResult {
        const r : IPathTestResult = {
            match: this._re.test(path)
        };
        if(r.match) {
            const params : any = {};
            const er = this._re.exec(path);
            this._keys.forEach((key, idx) => {
                params[key.name] = decodeURIComponent(er[idx + 1]);
            });
            r.params = params;
        }
        return r;
    }
    
    toPath(params: any) : string {
        if(!this._pf) {
            this._pf = compile(this._text);
        }
        return this._pf(params);
    }
    
    toString() {
        return this._text;
    }
}

const matches = (value : string, pattern : string) : boolean => {
    const template = new PathTemplate(pattern);
    const mr = template.test(value);
    return mr.match;
};

export { PathTemplate, matches };