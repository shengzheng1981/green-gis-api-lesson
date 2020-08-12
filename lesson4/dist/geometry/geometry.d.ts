import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { Symbol } from "../symbol/symbol";
export declare enum GeometryType {
    Point = 1,
    Polyline = 2,
    Polygon = 3
}
export declare class Geometry {
    protected _projected: boolean;
    protected _projection: Projection;
    protected _bound: Bound;
    get bound(): Bound;
    project(projection: Projection): void;
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: Symbol): void;
}
