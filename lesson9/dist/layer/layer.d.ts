import { Projection } from "../projection/projection";
import { Bound } from "../util/bound";
import { Subject } from "../util/subject";
/**
 * 图层基类
 */
export declare class Layer extends Subject {
    /**
     * 图层名称
     */
    name: string;
    /**
     * 图层描述
     */
    description: string;
    /**
     * 图层可见设置
     */
    protected _visible: boolean;
    /**
     * 图层是否可见
     */
    get visible(): boolean;
    /**
     * 图层可见设置
     */
    set visible(value: boolean);
    /**
     * 图层可交互设置
     */
    protected _interactive: boolean;
    /**
     * 图层是否可交互
     */
    get interactive(): boolean;
    /**
     * 图层可交互设置
     */
    set interactive(value: boolean);
    /**
     * 创建图层
     */
    constructor();
    /**
     * 绘制图层
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
