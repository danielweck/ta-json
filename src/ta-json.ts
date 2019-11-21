import { serialize } from "./methods/serialize";
import { deserialize } from "./methods/deserialize";
import { IGenerateOptions, IParseOptions } from "./types";

type TConstructor<T> = new(value?:any) => T;
// type TFunction<T> = ObjectConstructor["constructor"] & TConstructor<T>;

export class TaJson {
    public static deserialize<T>(object:any, type?:TConstructor<T>, options?:IParseOptions):T {
        return deserialize(object, type, options);
    }

    public static parse<T>(json:string, type?:TConstructor<T>, options?:IParseOptions):T {
        return this.deserialize<T>(JSON.parse(json), type, options);
    }

    public static serialize(value:any, options?:IGenerateOptions):any {
        return serialize(value, undefined, options);
    }

    public static stringify(object:any, options?:IGenerateOptions):string {
        return JSON.stringify(this.serialize(object, options));
    }
}
