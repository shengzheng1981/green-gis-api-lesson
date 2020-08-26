import { Layer } from "./layer";
import { WebMercator } from "../projection/web-mercator";
export class GraphicLayer extends Layer {
    constructor() {
        super(...arguments);
        this._graphics = [];
    }
    //地图事件注册监听
    on(event, handler) {
        this._graphics.forEach((graphic) => {
            graphic.on(event, handler);
        });
    }
    off(event, handler) {
        this._graphics.forEach((graphic) => {
            graphic.off(event, handler);
        });
    }
    emit(event, param) {
        this._graphics.forEach((graphic) => {
            graphic.emit(event, param);
        });
    }
    add(graphic) {
        this._graphics.push(graphic);
    }
    remove(graphic) {
        const index = this._graphics.findIndex(item => item === graphic);
        index != -1 && this._graphics.splice(index, 1);
    }
    clear() {
        this._graphics = [];
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        if (this.visible) {
            this._graphics.forEach((graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }
    contain(screenX, screenY, projection = new WebMercator(), extent = projection.bound, zoom = 10, event = undefined) {
        if (this.visible) {
            const graphics = this._graphics.filter((graphic) => graphic.intersect(projection, extent)).filter((graphic) => {
                return graphic.contain(screenX, screenY, event);
            });
            if (graphics.length > 0) {
                if (event == "dblclick") {
                    graphics[0].emit("dblclick", { graphic: graphics[0], screenX: screenX, screenY: screenY });
                }
                else if (event == "click") {
                    graphics[0].emit("click", { graphic: graphics[0], screenX: screenX, screenY: screenY });
                }
                else if (event == "dragstart") {
                    graphics[0].emit("dragstart", { graphic: graphics[0], screenX: screenX, screenY: screenY });
                }
                return true;
            }
            else {
                return false;
            }
        }
    }
}
