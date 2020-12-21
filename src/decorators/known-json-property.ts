import { getDefinition } from "../classes/object-definition";

// tslint:disable:ext-variable-name only-arrow-functions

export function KnownJsonProperty(property:string):ClassDecorator {
    return function(constructor:Function):void {
        getDefinition(constructor).knownProperty = property;
    };
}
