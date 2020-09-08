import {Layer} from "./layer";
import {Graphic} from "../element/graphic";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";

/**
 * 图形要素图层
 */
export class GraphicLayer extends Layer{

    /**
     * 图形要素集合
     */
    private _graphics: Graphic[] = [];

    /**
     * 重写事件注册监听
     * @remarks
     * 对图层的监听，重写为遍历对该图层下所有要素的监听
     * 该写法只是一种简写，无他。
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    on(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.on(event, handler);
        });
    }
    /**
     * 重写事件取消监听
     * @param {string} event - 事件名称
     * @param {Function} handler - 回调函数
     */
    off(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.off(event, handler);
        });
    }
    /**
     * 重写事件激发
     * @param {string} event - 事件名称
     * @param {Object} param - 事件参数
     */
    emit(event, param) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.emit(event, param);
        });
    }

    /**
     * 添加图形
     * @param {Graphic} graphic - 图形
     */
    add(graphic: Graphic) {
        this._graphics.push(graphic);
    }

    /**
     * 删除图形
     * @param {Graphic} graphic - 图形
     */
    remove(graphic: Graphic) {
        const index = this._graphics.findIndex(item => item === graphic);
        index != -1 && this._graphics.splice(index, 1);
    }

    /**
     * 清空图形集合
     */
    clear() {
        this._graphics = [];
    }

    /**
     * 绘制图层
     * @remarks
     * 遍历图形集合进行绘制
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     * @param {Bound} extent - 当前可视范围
     * @param {number} zoom - 当前缩放级别
     */
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible) {
            this._graphics.forEach( (graphic: Graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }

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
    contain(screenX: number, screenY: number, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10, event: string = undefined): boolean {
        if (this.visible) {
            //遍历可视范围内的图形，判断是否落入某个图形
            const graphics = this._graphics.filter((graphic: Graphic) => graphic.intersect(projection, extent)).filter( (graphic: Graphic) => {
                return graphic.contain(screenX, screenY, event);
            });
            if (graphics.length > 0) {
                //如为dblclick、click，则触发该图形的对应事件
                //多个时，默认只触发第一个，该行为可被重写。
                if (event == "dblclick") {
                    graphics[0].emit("dblclick", {graphic: graphics[0], screenX: screenX, screenY: screenY});
                } else if (event == "click") {
                    graphics[0].emit("click", {graphic: graphics[0], screenX: screenX, screenY: screenY});
                } 
                return true;
            } else {
                return false;
            }
        }
    }

}