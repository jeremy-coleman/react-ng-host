import { IPathTestResult } from './IPathTestResult';

interface IPathTemplate {
    text: string;
    paramCount: number;
    paramNames: string[];
    test(path : string) : IPathTestResult;
    toPath(params : any) : string;
}

export { IPathTemplate };