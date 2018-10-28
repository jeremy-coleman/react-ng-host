import * as React from 'react';

import { exactPath } from './exactPath';
import { IRequest, IRequestHandler } from './types';

interface IReactRouterOptions {
    exportKey?: string;
    exact?: boolean;
    allowTrailingSlash?: boolean;
    requestPropKey?: string;
}

const DefaultReactRouterOptions = {
    exact: true,
    allowTrailingSlash: true,
    requestPropKey: "match"
};

const reactRouter = (importer: () => Promise<any> | any, opts?: IReactRouterOptions): IRequestHandler => {
    const mergedOpts = Object.assign({}, DefaultReactRouterOptions, opts);
    const handler = (request : IRequest) => {
        return Promise.resolve(importer()).then(m => {
            const type = mergedOpts.exportKey ? m[mergedOpts.exportKey] : m.default;
            if(!type) {
                throw { code: "ILLEGAL_ARGUMENT", message: "Unable to resolve React Component Type"};
            }
            const props = {};
            props[mergedOpts.requestPropKey] = request;
            return React.createElement(type, props);
        });
    };
    return mergedOpts.exact ? exactPath(handler, mergedOpts) : handler;
};

export { IReactRouterOptions, DefaultReactRouterOptions, reactRouter, reactRouter as default };
