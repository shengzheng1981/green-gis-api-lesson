import { Layer } from "./layer";
import { Graphic } from "../element/graphic";
import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
/**
 * 图形要素图层
 */
export declare class GraphicLayer extends Layer {
    /**
     * 图形要素集合
     */
    private _graphics;
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
     * 添加图形
     * @param {Graphic} graphic - 图形
     */
    add(graphic: Graphic): void;
    /**
     * 删除图形
     * @param {Graphic} graphic - 图形
     */
    remove(graphic: Graphic): void;
    /**
     * 清空图形集合
     */
    clear(): void;
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
