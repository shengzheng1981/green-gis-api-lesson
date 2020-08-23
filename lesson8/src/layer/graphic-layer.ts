import {Layer} from "./layer";
import {Graphic} from "../element/graphic";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Bound} from "../util/bound";

export class GraphicLayer extends Layer{
    private _graphics: Graphic[] = [];

    //地图事件注册监听
    on(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.on(event, handler);
        });
    }

    off(event, handler) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.off(event, handler);
        });
    }

    emit(event, param) {
        this._graphics.forEach( (graphic: Graphic) => {
            graphic.emit(event, param);
        });
    }

    add(graphic: Graphic) {
        this._graphics.push(graphic);
    }

    remove(graphic: Graphic) {
        const index = this._graphics.findIndex(item => item === graphic);
        index != -1 && this._graphics.splice(index, 1);
    }

    clear() {
        this._graphics = [];
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10) {
        if (this.visible) {
            this._graphics.forEach( (graphic: Graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }

    contain(screenX: number, screenY: number, projection: Projection = new WebMercator(), extent: Bound = projection.bound, zoom: number = 10, event: string = undefined): boolean {
        if (this.visible) {
            const graphics = this._graphics.filter((graphic: Graphic) => graphic.intersect(projection, extent)).filter( (graphic: Graphic) => {
                return graphic.contain(screenX, screenY, event);
            });
            if (graphics.length > 0) {
                if (event == "dblclick") {
                    graphics[0].emit("dblclick", {graphic: graphics[0], screenX: screenX, screenY: screenY});
                } else if (event == "click") {
                    graphics[0].emit("click", {graphic: graphics[0], screenX: screenX, screenY: screenY});
                } else if (event == "dragstart") {
                    graphics[0].emit("dragstart", {graphic: graphics[0], screenX: screenX, screenY: screenY});
                }
                return true;
            } else {
                return false;
            }
        }
    }

}