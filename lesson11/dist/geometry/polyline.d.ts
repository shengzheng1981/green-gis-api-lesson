import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { LineSymbol } from "../symbol/symbol";
/**
 * 线
 * @remarks
 * 数据结构：such as [[1,1],[2,2],[1,2]]
 */
export declare class Polyline extends Geometry {
    /**
     * 容差
     * @remarks
     * 用于交互（线宽较小的情况下，难以选中）
     * screen pixel
     */
    static TOLERANCE: number;
    /**
     * 交互鼠标坐标到线垂直距离的可选范围
     * @remarks
     * 可选范围 = 容差 + 线宽
     * TOLERANCE + symbol.lineWidth
     */
    private _tolerance;
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
     * 经纬度
     */
    get lnglats(): number[][];
    /**
     * 平面坐标
     */
    get coordinates(): number[][];
    /**
     * 创建线
     * @param {number[][]} lnglats - 坐标集合，二维数组
     */
    constructor(lnglats: number[][]);
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection: Projection): void;
    /**
     * 绘制线
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: LineSymbol): void;
    /**
     * 获取线的中心点
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
     * 线是1维，所以要设置一个tolerance容差，来判断坐标是否落到线上
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean;
}
