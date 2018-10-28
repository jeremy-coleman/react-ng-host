import { IRequest } from './IRequest';
import { IRequestHandler } from './IRequestHandler';

interface IRouter {
    handleRequest(req : IRequest, next?: IRequestHandler) : Promise<any> | any;
}

export { IRouter }