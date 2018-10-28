import { PathTemplate } from './PathTemplate';
import { IRequest, IRequestHandler, IRouter, IRouterManager } from './types';


export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

//import { isFunction, isString } from 'ts-util-is';
// interface IRouterEntry {
//     r: IRouter;
//     next?: IRouterEntry;
// }

const notFoundHandler : IRequestHandler = (req : IRequest) => {
    return Promise.reject({ code: "NOT_FOUND", request: req, message: `Unable to find handler for ${req.path}`});
};

const uselessRouter : IRouter = {
    handleRequest(req : IRequest, next?: IRequestHandler) {
        return Promise.resolve(next ? next(req) : notFoundHandler(req));
    }
};

class RequestHandlerRouter implements IRouter {
    private _requestHandler : IRequestHandler;
    constructor(requestHandler : IRequestHandler) {
        this._requestHandler = requestHandler;
    }
    handleRequest(req : IRequest, next?: IRequestHandler) {
        return Promise.resolve(this._requestHandler(req, next));
    }
}

const createRouter = (router : IRouter | IRequestHandler) : IRouter  => {
    if(isFunction(router)) {
        return new RequestHandlerRouter(router as IRequestHandler);
    }
    return router ? router as IRouter : uselessRouter;
};

class PathRouter implements IRouter {
    private _pathTemplate : PathTemplate;
    private _router : IRouter;
    constructor(path : string, router : IRouter | IRequestHandler) {
        this._pathTemplate = new PathTemplate(path, { end: false });
        this._router = createRouter(router);
    }
    handleRequest(req : IRequest, next: IRequestHandler = notFoundHandler) {
        const testPath = req.basePath ? req.path.substring(req.basePath.length) : req.path;
        const testResult = this._pathTemplate.test(testPath);
        if(testResult.match) {
            const handlerReq = Object.assign({}, req);
            handlerReq.params = Object.assign({}, req.params, testResult.params);
            const matchedPath = this._pathTemplate.toPath(handlerReq.params);
            handlerReq.basePath = req.basePath ? req.basePath + matchedPath : matchedPath;
            return this._router.handleRequest(handlerReq, next);
        }
        next();
    }
}

interface IRequestContext {
    request: IRequest;
    next: boolean;
    value?: any;
}

class Router implements IRouter, IRouterManager {
    private _routers : IRouter[] = [];
    defaultHandler : IRequestHandler;
    public use(pathOrRouter: string | IRouter | IRequestHandler, router?: IRouter | IRequestHandler) : void {
        let r : IRouter;
        if(isString(pathOrRouter)) {
            r = new PathRouter(pathOrRouter as string, router);
        } else {
            r = createRouter(pathOrRouter as IRouter | IRequestHandler);
        }
        this._routers.push(r);
    }
    private _processRouter(router : IRouter, context : IRequestContext, next : IRequestHandler) : Promise<any> {
        return Promise.resolve(router.handleRequest(context.request, next)).then(value => {
            if(!context.next) {
                context.value = value;
            }
        });
    }
    private _nextRouterHandler(router : IRouter, context : IRequestContext, next : IRequestHandler) {
        return () => {
            if(context.next) {
                context.next = false;
                return this._processRouter(router, context, next);
            }
            return Promise.resolve();
        };
    }
    public handleRequest(req : IRequest, next: IRequestHandler = notFoundHandler) : Promise<any> {
        const fallThrough = (req) => {
            return this.defaultHandler ? this.defaultHandler(req, next) : next(req);
        };
        const context : IRequestContext = {
            request: req,
            next: false
        };
        const nextInternal = (request : IRequest) => {
            if(request) {
                context.request = request;
            }
            context.next = true;
        };
        let p : Promise<any>;
        this._routers.forEach(r => {
            if(!p) {
                p = this._processRouter(r, context, nextInternal);
            } else {
                p = p.then(this._nextRouterHandler(r, context, nextInternal));
            }
        });
        if(!p) {
            p = Promise.resolve(fallThrough(context.request));
        } else {
            p = p.then(() => {
                if(context.next) {
                    return Promise.resolve(fallThrough(context.request));
                }
                return context.value;
            });
        }
        return p;
    }
}

export { Router }