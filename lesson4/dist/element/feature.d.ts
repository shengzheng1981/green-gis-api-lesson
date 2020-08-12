import { Bound } from "../util/bound";
import { Geometry } from "../geometry/geometry";
import { Symbol } from "../symbol/symbol";
import { Projection } from "../projection/projection";
export declare class Feature {
    private _geometry;
    private _properties;
    private _symbol;
    visible: boolean;
    get symbol(): Symbol;
    set symbol(value: Symbol);
    get geometry(): Geometry;
    get properties(): any;
    get bound(): Bound;
    constructor(geometry: any, properties: any, symbol?: any);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: Symbol): void;
}
