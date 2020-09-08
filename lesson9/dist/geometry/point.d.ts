import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { PointSymbol } from "../symbol/symbol";
/**
 * 点
 */
export declare class Point extends Geometry {
    /**
     * 经纬度-经度
     */
    private _lng;
    /**
     * 经纬度-纬度
     */
    private _lat;
    /**
     * 平面坐标-X
     */
    private _x;
    /**
     * 平面坐标-Y
     */
    private _y;
    /**
     * 屏幕坐标-X
     */
    private _screenX;
    /**
     * 屏幕坐标-Y
     */
    private _screenY;
    /**
     * 记录用于判断鼠标是否进入交互范围
     */
    private _symbol;
    /**
     * 创建点
     * @param {number} lng - 经度
     * @param {number} lat - 纬度
     */
    constructor(lng: number, lat: number);
    /**
     * 投影变换
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection: Projection): void;
    /**
     * 绘制点
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: PointSymbol): Promise<void>;
    /**
     * 获取中心点
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type?: CoordinateType, projection?: Projection): number[];
    /**
     * 是否包含传入坐标
     * @remarks
     * 由于点是0维，主要根据渲染的符号大小来判断传入坐标是否落到点内
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean;
}
