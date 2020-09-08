import { Bound } from "../util/bound";
import { Projection } from "./projection";
/**
 * 球体墨卡托
 */
export declare class WebMercator extends Projection {
    /**
     * 地球半径
     */
    static R: number;
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
}
