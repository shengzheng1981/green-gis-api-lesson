import { Bound } from "../util/bound";
import { LatLngType, Projection } from "./projection";
/**
 * 带国测局02偏移的球体墨卡托投影
 * @remarks https://github.com/wandergis/coordtransform
 * just for china
 */
export declare class GCJ02 extends Projection {
    /**
     * 地球半径
     */
    static R: number;
    /**
     * ee
     * @remarks
     * 不知含义的常数，用于WGS-84 与 GCJ-02 之间的转换
     */
    static ee: number;
    private _type;
    /**
     * 创建带国测局02偏移的球体墨卡托投影
     * @remarks 参考经纬度坐标类型，不同类型走不同数据处理流程
     * @param {LatLngType} type - 经纬度坐标类型
     */
    constructor(type?: LatLngType);
    /**
     * 投影后的平面坐标范围
     */
    get bound(): Bound;
    /**
     * 经纬度转平面坐标
     * @remarks 地理平面坐标 单位米
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     * @return {number[]} 地理平面坐标
     */
    project([lng, lat]: [any, any]): number[];
    /**
     * 平面坐标转经纬度
     * @remarks 地理平面坐标 单位米
     * @param {number} x - 地理平面坐标x
     * @param {number} y - 地理平面坐标y
     * @return {number[]} 经纬度
     */
    unproject([x, y]: [any, any]): number[];
    /**
     * WGS-84 转 GCJ-02
     * @remarks https://github.com/wandergis/coordtransform
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static wgs84togcj02(lng: any, lat: any): any[];
    /**
     * GCJ-02 转换为 WGS-84
     * @remarks https://github.com/wandergis/coordtransform
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static gcj02towgs84(lng: any, lat: any): number[];
    static _transformlat(lng: any, lat: any): number;
    static _transformlng(lng: any, lat: any): any;
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @remarks 此判断欠妥，暂不采用！
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng: any, lat: any): boolean;
}
