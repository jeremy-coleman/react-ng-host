import { IRequestHandler } from './IRequestHandler';
import { IRouter } from './IRouter';

interface IRouterManager {
    use(pathOrRouter: string | IRouter | IRequestHandler, router?: IRouter | IRequestHandler) : void;
}

export { IRouterManager }