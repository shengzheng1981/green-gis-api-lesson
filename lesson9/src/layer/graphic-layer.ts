import {Layer} from "./layer";
import {Graphic} from "../element/graphic";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";
//图形要素图层
export class GraphicLayer extends Layer{
    //图形要素集合
    private _graphics: Graphic[] = [];

    //重写事件注册监听
    //****************重要说明***************
    //对图层的监听，重写为遍历对该图层下所有要素的监听
    //该写法只是一种简写，无他。
    on(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.on(event, handler);
        });
    }
    //重写事件取消监听
    off(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.off(event, handler);
        });
    }
    //重写事件激发
    emit(event, param) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.emit(event, param);
        });
    }
    //添加图形
    add(graphic: Graphic) {
        this._graphics.push(graphic);
    }
    //删除图形
    remove(graphic: Graphic) {
        const index = this._graphics.findIndex(item => item === graphic);
        index != -1 && this._graphics.splice(index, 1);
    }
    //清空图形集合
    clear() {
        this._graphics = [];
    }
    //绘制图形
    //遍历图形集合进行绘制
    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible) {
            this._graphics.forEach( (graphic: Graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }
    //图层交互：当前鼠标是否落入该图层某图形要素
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