import { Bound } from "../util/bound";
import { Projection } from "./projection";
export declare class WebMercator extends Projection {
    static R: number;
    get bound(): Bound;
    project([lng, lat]: [any, any]): number[];
    unproject([x, y]: [any, any]): number[];
}
