import { Field } from "../data/field";
import { SimpleTextSymbol } from "../symbol/symbol";
import { Collision } from "./collision";
import { Projection } from "../projection/projection";
import { Feature } from "../element/feature";
export declare class Label {
    field: Field;
    symbol: SimpleTextSymbol;
    collision: Collision;
    draw(features: Feature[], ctx: CanvasRenderingContext2D, projection?: Projection): void;
}
