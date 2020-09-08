import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { SimpleTextSymbol, Symbol } from "../symbol/symbol";
/**
 * 坐标类型
 * @enum {number}
 */
export declare enum CoordinateType {
    /**
     * 经纬度坐标
     */
    Latlng = 1,
    /**
     * 地理平面坐标
     */
    Projection = 2,
    /**
     * 屏幕平面坐标
     */
    Screen = 3
}
/**
 * 图形类型
 * @enum {number}
 */
export declare enum GeometryType {
    /**
     * 点
     */
    Point = 1,
    /**
     * 线
     */
    Polyline = 2,
    /**
     * 面
     */
    Polygon = 3
}
/**
 * 图形基类
 */
export declare class Geometry {
    /**
     * 是否已经过投影（优化用）
     */
    protected _projected: boolean;
    /**
     * 坐标投影变换
     */
    protected _projection: Projection;
    /**
     * 包络矩形
     * @remarks
     * 注意bound的坐标类型：一般为地理平面坐标，即投影后坐标
     */
    protected _bound: Bound;
    /**
     * 投影变换虚函数
     * @param {Projection} projection - 坐标投影转换
     */
    project(projection: Projection): void;
    /**
     * 图形绘制虚函数
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {Symbol} symbol - 渲染符号
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, symbol?: Symbol): void;
    /**
     * 图形包络矩形与可见视图范围是否包含或相交
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @return {boolean} 是否在可视范围内
     */
    intersect(projection?: Projection, extent?: Bound): boolean;
    /**
     * 获取图形中心点虚函数
     * @param {CoordinateType} type - 坐标类型
     * @param {Projection} projection - 坐标投影转换
     * @return {number[]} 中心点坐标
     */
    getCenter(type?: CoordinateType, projection?: Projection): void;
    /**
     * 获取两个图形间距离
     * @remarks
     * 当前为两图形中心点间的直线距离
     * 多用于聚合判断
     * @param {Geometry} geometry - 另一图形
     * @param {CoordinateType} type - 坐标类型
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @return {number} 距离
     */
    distance(geometry: Geometry, type: CoordinateType, ctx: CanvasRenderingContext2D, projection?: Projection): number;
    /**
     * 标注绘制
     * @remarks
     * 标注文本支持多行，/r/n换行
     * @param {string} text - 标注文本
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {SimpleTextSymbol} symbol - 标注符号
     */
    label(text: string, ctx: CanvasRenderingContext2D, projection?: Projection, symbol?: SimpleTextSymbol): void;
    /**
     * 标注量算
     * @remarks
     * 标注文本支持多行，/r/n换行
     * 目前用于寻找自动标注最合适的方位：top bottom left right
     * @param {string} text - 标注文本
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {SimpleTextSymbol} symbol - 标注符号
     */
    measure(text: string, ctx: CanvasRenderingContext2D, projection?: Projection, symbol?: SimpleTextSymbol): Bound;
    /**
     * 是否包含传入坐标
     * @remarks 主要用于鼠标交互
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number): boolean;
}
