import { Bound } from "../util/bound";
import { LatLngType, Projection } from "./projection";
export declare class GCJ02 extends Projection {
    static R: number;
    static ee: number;
    private _type;
    constructor(type?: LatLngType);
    get bound(): Bound;
    project([lng, lat]: [any, any]): number[];
    unproject([x, y]: [any, any]): number[];
    /**
     * WGS-84 转 GCJ-02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static wgs84togcj02(lng: any, lat: any): any[];
    /**
     * GCJ-02 转换为 WGS-84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    static gcj02towgs84(lng: any, lat: any): number[];
    static _transformlat(lng: any, lat: any): number;
    static _transformlng(lng: any, lat: any): any;
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng: any, lat: any): boolean;
}
