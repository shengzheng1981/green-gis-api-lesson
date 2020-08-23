import { Bound } from "../util/bound";
import { Geometry } from "../geometry/geometry";
import { Symbol, SimpleTextSymbol } from "../symbol/symbol";
import { Projection } from "../projection/projection";
import { Field } from "../data/field";
import { Subject } from "../util/subject";
export declare class Feature extends Subject {
    private _geometry;
    private _properties;
    private _symbol;
    private _text;
    private _contained;
    visible: boolean;
    get symbol(): Symbol;
    set symbol(value: Symbol);
    get geometry(): Geometry;
    get properties(): any;
    get bound(): Bound;
    get text(): SimpleTextSymbol;
    set text(value: SimpleTextSymbol);
    constructor(geometry: any, properties: any, symbol?: any);
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: Symbol): void;
    intersect(projection?: Projection, extent?: Bound): boolean;
    label(field: Field, ctx: CanvasRenderingContext2D, projection?: Projection, symbol?: SimpleTextSymbol): void;
    contain(screenX: number, screenY: number, event?: string): boolean;
}
