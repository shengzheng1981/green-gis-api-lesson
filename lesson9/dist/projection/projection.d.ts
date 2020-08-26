import { Bound } from "../util/bound";
export declare enum LatLngType {
    GPS = 1,
    GCJ02 = 2,
    BD09 = 3
}
export declare class Projection {
    project([lng, lat]: [any, any]): number[];
    unproject([x, y]: [any, any]): number[];
    get bound(): Bound;
}
