import {Bound} from "../util/bound";
import {Geometry} from "../geometry/geometry";
import {Symbol} from "../symbol/symbol";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Subject} from "../util/subject";

export class Graphic extends Subject{
    private _geometry: Geometry;
    private _symbol: Symbol;
    private _contained: boolean;
    public visible: boolean = true;

    get bound(): Bound {
        return this._geometry ? this._geometry.bound: null;
    }

    constructor(geometry, symbol) {
        super(["click", "dblclick", "mouseover", "mouseout", "dragstart"]);
        this._geometry = geometry;
        this._symbol = symbol;
    }

    draw(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator(), extent: Bound = projection.bound) {
        if (this.visible) this._geometry.draw(ctx, projection, extent, this._symbol);
    }

    intersect(projection: Projection = new WebMercator(), extent: Bound = projection.bound): boolean {
        if (this.visible) return this._geometry.intersect(projection, extent);
    }

    contain(screenX: number, screenY: number, event: string = undefined): boolean {
        if (this.visible) {
            const flag = this._geometry.contain(screenX, screenY);
            if (event == "mousemove") {
                if (!this._contained && flag) {
                    this.emit("mouseover", {feature: this, screenX: screenX, screenY: screenY})
                } else if(this._contained && !flag) {
                    this.emit("mouseout", {feature: this, screenX: screenX, screenY: screenY})
                }
            }
            this._contained = flag;
            return flag;
        }
    }

}