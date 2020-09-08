import { Bound } from "../util/bound";
import { LatLngType, Projection } from "./projection";
/**
 * 带百度09偏移的球体墨卡托投影
 * @remarks https://github.com/wandergis/coordtransform
 * just for china
 * 依赖Baidu Map API
 */
export declare class BD09 extends Projection {
    /**
     * 百度平面坐标系的坐标原点与百度瓦片坐标原点相同，以瓦片等级18级为基准，规定18级时百度平面坐标的一个单位等于屏幕上的一个像素
     */
    static TOTAL_PIXELS: number;
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
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
     * @remarks
     * from https://github.com/wandergis/coordtransform
     * 即 百度 转 谷歌、高德
     * @param bd_lng
     * @param bd_lat
     * @returns {number[]}
     */
    static bd09togcj02(bd_lng: any, bd_lat: any): number[];
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * @remarks
     * from https://github.com/wandergis/coordtransform
     * 即 谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static gcj02tobd09(lng: any, lat: any): number[];
}
