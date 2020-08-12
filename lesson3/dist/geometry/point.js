var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Geometry } from "./geometry";
import { Bound } from "../util/bound";
import { SimpleMarkerSymbol, SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
//点
export class Point extends Geometry {
    constructor(lng, lat) {
        super();
        this._lng = lng;
        this._lat = lat;
    }
    ;
    //need interface to separate dependence
    /* addTo(map) {
        this._projection = map.projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        map.addGeometry(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.beginPath(); //Start path
        const matrix = (ctx as any).getTransform();
        //keep radius size
        ctx.setTransform(1,0,0,1,0,0);
        ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), Point.RADIUS, 0, Math.PI * 2, true);

        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }; */
    project(projection) {
        this._projection = projection;
        [this._x, this._y] = this._projection.project([this._lng, this._lat]);
        //TODO: bound tolerance
        this._bound = new Bound(this._x, this._y, this._x, this._y);
        this._projected = true;
    }
    draw(ctx, projection = new WebMercator(), extent = projection.bound, symbol = new SimplePointSymbol()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._projected)
                this.project(projection);
            if (!extent.intersect(this._bound))
                return;
            ctx.save();
            if (symbol instanceof SimplePointSymbol) {
                ctx.strokeStyle = symbol.strokeStyle;
                ctx.fillStyle = symbol.fillStyle;
                ctx.lineWidth = symbol.lineWidth;
                ctx.beginPath(); //Start path
                const matrix = ctx.getTransform();
                //keep size
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.arc((matrix.a * this._x + matrix.e), (matrix.d * this._y + matrix.f), symbol.radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.stroke();
            }
            else if (symbol instanceof SimpleMarkerSymbol) {
                const marker = symbol;
                if (!marker.loaded)
                    yield marker.load();
                if (marker.icon) {
                    const matrix = ctx.getTransform();
                    //keep size
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.drawImage(marker.icon, (matrix.a * this._x + matrix.e) - marker.offsetX, (matrix.d * this._y + matrix.f) - marker.offsetY, marker.width, marker.height);
                }
            }
            ctx.restore();
        });
    }
    ;
}
Point.RADIUS = 10; //10px
