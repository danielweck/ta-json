/// <reference types="node" />
import { IPropertyConverter } from './converter';
import { JsonValue } from '../types';
export declare class BufferConverter implements IPropertyConverter {
    private _encoding;
    serialize(property: Buffer): JsonValue;
    deserialize(value: JsonValue): Buffer;
    collapseArrayWithSingleItem(): boolean;
    constructor(encoding?: string);
}
