import { Layer } from "./layer";
import { Bound } from "../util/bound";
import { Projection } from "../projection/projection";
import { FeatureClass } from "../data/feature-class";
import { Renderer } from "../renderer/renderer";
import { Label } from "../label/label";
/**
 * 矢量要素图层
 */
export declare class FeatureLayer extends Layer {
    /**
     * 矢量要素类（数据源）
     */
    private _featureClass;
    /**
     * 图层渲染方式
     */
    private _renderer;
    /**
     * 图层可见缩放级别
     */
    private _zoom;
    /**
     * 图层标注设置
     */
    private _label;
    /**
     * 是否显示标注
     */
    labeled: boolean;
    /**
     * 是否聚合
     */
    cluster: boolean;
    /**
     * 矢量要素类（数据源）
     */
    get featureClass(): FeatureClass;
    /**
     * 矢量要素类（数据源）
     */
    set featureClass(value: FeatureClass);
    /**
     * 图层标注设置
     */
    set label(value: Label);
    /**
     * 图层渲染方式设置
     */
    set renderer(value: Renderer);
    /**
    * 重写事件注册监听
    * @remarks
    * 对图层的监听，重写为遍历对该图层下所有要素的监听
    * 该写法只是一种简写，无他。
    * @param {string} event - 事件名称
    * @param {Function} handler - 回调函数
    */
    on(event: any, handler: any): void;
    /**
     * 重写事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event: any, handler: any): void;
    /**
     * 重写事件激发
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event: any, param: any): void;
    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
    /**
     * 绘制标注
     * @remarks
     * 本应起名为label，但与属性中setter重名，故起名为drawLabel，无奈。。。
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    drawLabel(ctx: CanvasRenderingContext2D, projection?: Projection, extent?: Bound, zoom?: number): void;
    /**
     * 图层交互
     * @remarks 当前鼠标是否落入该图层某要素
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenX - 鼠标屏幕坐标Y
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number, projection?: Projection, extent?: Bound, zoom?: number, event?: string): boolean;
}
