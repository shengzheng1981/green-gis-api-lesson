import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { FillSymbol } from "../symbol/symbol";
/**
 * 面
 * @remarks
 * 数据结构：[ring[point[x,y]]]：such as [[[1,1],[2,2],[1,2]], [[1.5,1.5],[1.9,1.9],[1.5,1.9]]]
 */
export declare class Polygon extends Geometry {
    /**
     * 经纬度
     */
    private _lnglats;
    /**
     * 平面坐标
     */
    private _coordinates;
    /**
     * 屏幕坐标
     */
    private _screen;
    /**
     * 创建面
     * @param {number[][][]} lnglats - 坐标集合，三维数组
     */
    constructor(lnglats: number[][][]);
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection: Projection): void;
    /**
     * 绘制面
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: FillSymbol): void;
    /**
     * 获取面的中心点
     * @remarks
     * from Leaflet
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type?: CoordinateType, projection?: Projection): any;
    /**
     * 是否包含传入坐标
     * @remarks
     * 点是不是落在面内
     * from https://github.com/substack/point-in-polygon
     * ray-casting algorithm based on
     * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean;
}
