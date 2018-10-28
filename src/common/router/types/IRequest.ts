interface IRequest {
    app?: any;
    basePath?: string;
    path?: string;
    params?: { [key: string] : any };
    [key : string] : any;
}

export { IRequest }