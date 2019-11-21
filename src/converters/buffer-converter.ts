import { IPropertyConverter } from "./converter";
import { JsonValueArray, JsonValue, JsonValueObject } from "../types";

export interface IJsonBuffer extends JsonValueObject {
    type:"Buffer";
    data:number[];
}

export type IBuffer = IJsonBuffer | string;

export class BufferConverter implements IPropertyConverter {
    private _encoding:BufferEncoding|"json";

    constructor(encoding:BufferEncoding|"json" = "json") {
        this._encoding = encoding;
    }

    public serialize(property:Buffer):IBuffer {
        if (this._encoding === "json") {
            return property.toJSON();
        }
        return property.toString(this._encoding);
    }

    public deserialize(value:IBuffer):Buffer {
        if (this._encoding === "json") {
            return Buffer.from((value as IJsonBuffer).data);
        }
        return Buffer.from(value as string, this._encoding);
    }

    public collapseArrayWithSingleItem():boolean {
        return false;
    }
}
