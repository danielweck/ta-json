/// <reference types="node" />
import { IPropertyConverter } from "./converter";
import { JsonValueArray, JsonValueObject } from "../types";
export interface IJsonBuffer extends JsonValueObject {
    type: "Buffer";
    data: JsonValueArray;
}
export declare type IBuffer = IJsonBuffer | string;
export declare class BufferConverter implements IPropertyConverter {
    private _encoding;
    constructor(encoding?: string);
    serialize(property: Buffer): IBuffer;
    deserialize(value: IBuffer): Buffer;
    collapseArrayWithSingleItem(): boolean;
}
