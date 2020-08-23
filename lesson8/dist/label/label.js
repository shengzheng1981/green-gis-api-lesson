import { SimpleTextSymbol } from "../symbol/symbol";
import { SimpleCollision } from "./collision";
import { WebMercator } from "../projection/web-mercator";
export class Label {
    constructor() {
        this.symbol = new SimpleTextSymbol();
        this.collision = new SimpleCollision();
    }
    draw(features, ctx, projection = new WebMercator()) {
        const remain = this.collision.test(features, this.field, this.symbol, ctx, projection);
        remain.forEach((feature) => {
            feature.label(this.field, ctx, projection, this.symbol);
        });
    }
}
