var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Geometry, CoordinateType } from "./geometry";
import { Bound } from "../util/bound";
import { SimplePointSymbol } from "../symbol/symbol";
import { WebMercator } from "../projection/web-mercator";
//点
export class Point extends Geometry {
    constructor(lng, lat) {
        super();
        this._lng = lng;
        this._lat = lat;
    }
    ;
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
            const matrix = ctx.getTransform();
            this._screenX = (matrix.a * this._x + matrix.e);
            this._screenY = (matrix.d * this._y + matrix.f);
            this._symbol = symbol;
            this._symbol.draw(ctx, this._screenX, this._screenY);
            /*if (symbol instanceof SimplePointSymbol) {
                ctx.save();
                ctx.strokeStyle = (symbol as SimplePointSymbol).strokeStyle;
                ctx.fillStyle = (symbol as SimplePointSymbol).fillStyle;
                ctx.lineWidth = (symbol as SimplePointSymbol).lineWidth;
                ctx.beginPath(); //Start path
                //keep size
                //地理坐标 转回 屏幕坐标
                ctx.setTransform(1,0,0,1,0,0);
                ctx.arc(this._screenX, this._screenY, (symbol as SimplePointSymbol).radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            } else if (symbol instanceof SimpleMarkerSymbol) {
                const marker: SimpleMarkerSymbol = symbol;
                if (!marker.loaded) await marker.load();
                if (marker.icon) {
                    ctx.save();
                    const matrix = (ctx as any).getTransform();
                    //keep size
                    ctx.setTransform(1,0,0,1,0,0);
                    ctx.drawImage(marker.icon, this._screenX + marker.offsetX, this._screenY + marker.offsetY, marker.width, marker.height);
                    ctx.restore();
                }
            } */
        });
    }
    ;
    getCenter(type = CoordinateType.Latlng, projection = new WebMercator()) {
        if (!this._projected)
            this.project(projection);
        if (type === CoordinateType.Latlng) {
            return [this._lng, this._lat];
        }
        else {
            return [this._x, this._y];
        }
    }
    //由于点是0维，主要根据渲染的符号大小来判断传入坐标是否落到点内
    contain(screenX, screenY) {
        /*if (this._symbol instanceof SimplePointSymbol) {
            return Math.sqrt((this._screenX - screenX) *  (this._screenX - screenX) +  (this._screenY - screenY) *  (this._screenY - screenY)) <= (this._symbol as SimplePointSymbol).radius;
        } else if (this._symbol instanceof SimpleMarkerSymbol) {
            return screenX >= (this._screenX + this._symbol.offsetX) &&  screenX <= (this._screenX + this._symbol.offsetX + this._symbol.width) && screenY >= (this._screenY + this._symbol.offsetY) &&  screenY <= (this._screenY + this._symbol.offsetY + this._symbol.height);
        } else if (this._symbol instanceof LetterSymbol) {
            return Math.sqrt((this._screenX - screenX) *  (this._screenX - screenX) +  (this._screenY - screenY) *  (this._screenY - screenY)) <= (this._symbol as LetterSymbol).radius;
        } else if (this._symbol instanceof VertexSymbol) {
            return screenX >= (this._screenX - this._symbol.size / 2) &&  screenX <= (this._screenX + this._symbol.size / 2) && screenY >= (this._screenY - this._symbol.size / 2) &&  screenY <= (this._screenY + this._symbol.size / 2);
        }*/
        return this._symbol ? this._symbol.contain(this._screenX, this._screenY, screenX, screenY) : false;
    }
}
Point.RADIUS = 10; //10px
