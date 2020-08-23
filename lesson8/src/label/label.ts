import {Field} from "../data/field";
import {SimpleTextSymbol} from "../symbol/symbol";
import {Collision, SimpleCollision} from "./collision";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Feature} from "../element/feature";

export class Label {
    field: Field;
    symbol: SimpleTextSymbol = new SimpleTextSymbol();
    collision: Collision = new SimpleCollision();
    draw(features: Feature[], ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()) {
        const remain: Feature[] = this.collision.test(features, this.field, this.symbol, ctx, projection);
        remain.forEach((feature: Feature) => {
            feature.label(this.field, ctx, projection, this.symbol);
        });
    }
}