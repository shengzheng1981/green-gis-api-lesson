import { Layer } from "./layer";
import { WebMercator } from "../projection/web-mercator";
export class GraphicLayer extends Layer {
    constructor() {
        super(...arguments);
        this._graphics = [];
    }
    add(graphic) {
        this._graphics.push(graphic);
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, zoom = 10) {
        if (this.visible) {
            this._graphics.forEach((graphic) => {
                graphic.draw(ctx, projection, extent);
            });
        }
    }
}
