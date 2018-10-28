import { IRequest } from './IRequest';

interface IRequestHandler {
    (req?: IRequest, next?: IRequestHandler) : Promise<any> | any;
}

export { IRequestHandler }