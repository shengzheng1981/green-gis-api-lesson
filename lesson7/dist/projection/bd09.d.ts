import { Bound } from "../util/bound";
import { LatLngType, Projection } from "./projection";
export declare class BD09 extends Projection {
    static TOTAL_PIXELS: number;
    private _type;
    constructor(type?: LatLngType);
    get bound(): Bound;
    project([lng, lat]: [any, any]): number[];
    unproject([x, y]: [any, any]): number[];
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lng
     * @param bd_lat
     * @returns {*[]}
     */
    static bd09togcj02(bd_lng: any, bd_lat: any): number[];
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即 谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static gcj02tobd09(lng: any, lat: any): number[];
}
