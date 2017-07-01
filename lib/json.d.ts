import { IParseOptions } from './types';
export declare class JSON {
    static deserialize<T>(object: any, type?: Function, options?: IParseOptions): T;
    static parse<T>(json: string, type?: Function, options?: IParseOptions): T;
    static serialize(value: any): any;
    static stringify(object: any): string;
}
