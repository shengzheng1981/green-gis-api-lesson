import { Projection } from "../projection/projection";
import { Feature } from "../element/feature";
import { SimpleTextSymbol } from "../symbol/symbol";
import { Field } from "../data/field";
export declare class Collision {
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
export declare class NullCollision {
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
export declare class SimpleCollision {
    distance: number;
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
export declare class CoverCollision {
    private _bounds;
    buffer: number;
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection?: Projection): Feature[];
}
