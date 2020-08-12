import { Bound } from "../util/bound";
export declare class Projection {
    project([lng, lat]: [any, any]): number[];
    unproject([x, y]: [any, any]): number[];
    get bound(): Bound;
}
