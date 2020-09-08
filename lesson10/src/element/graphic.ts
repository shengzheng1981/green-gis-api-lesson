import {Bound} from "../util/bound";
import {Geometry} from "../geometry/geometry";
import {Symbol} from "../symbol/symbol";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Subject} from "../util/subject";

/**
 * 图形要素
 * 区别与Feature，单纯的图形
 */
export class Graphic extends Subject{
    /**
     * 空间图形
     */
    private _geometry: Geometry;
    /**
     * 渲染符号
     */
    private _symbol: Symbol;
    /**
     * 记录鼠标是否当前悬停在要素内
     */
    private _contained: boolean;
    /**
     * 是否可见
     */
    public visible: boolean = true;
    /**
     * 创建图形要素
     * @param {Geometry} geometry - 空间图形
     * @param {Symbol} symbol - 渲染符号
     */
    constructor(geometry, symbol) {
        //该对象可订阅如下事件
        super(["click", "dblclick", "mouseover", "mouseout"]);
        this._geometry = geometry;
        this._symbol = symbol;
    }

    /**
     * 绘制图形
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound) {
        if (this.visible) this._geometry.draw(ctx, projection, extent, this._symbol);
    }

    /**
     * 判断是否在可视范围内
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @return {boolean} 是否在可视范围内
     */
    intersect(projection: Projection = new WebMercator(), extent: Bound = projection.bound): boolean {
        if (this.visible) return this._geometry.intersect(projection, extent);
    }

    /**
     * 交互判断
     * 鼠标坐标是否落入图形
     * @param {number} screenX - 鼠标屏幕坐标X
     * @param {number} screenY - 鼠标屏幕坐标Y
     * @param {string} event - 当前事件名称
     * @return {boolean} 是否落入
     */
    contain(screenX: number, screenY: number, event: string = undefined): boolean {
        if (this.visible) {
            const flag = this._geometry.contain(screenX, screenY);
            if (event == "mousemove") {
                if (!this._contained && flag) {
                    //如果鼠标当前不在图形内，同时鼠标进入到图形内
                    this.emit("mouseover", {feature: this, screenX: screenX, screenY: screenY})
                } else if(this._contained && !flag) {
                    //如果鼠标当前在图形内，同时鼠标移出到图形外
                    this.emit("mouseout", {feature: this, screenX: screenX, screenY: screenY})
                }
            }
            this._contained = flag;
            return flag;
        }
    }

}