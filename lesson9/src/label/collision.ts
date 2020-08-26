import {CoordinateType} from "../geometry/geometry";
import {Projection} from "../projection/projection";
import {WebMercator} from "../projection/web-mercator";
import {Feature} from "../element/feature";
import {SimpleTextSymbol} from "../symbol/symbol";
import {Field} from "../data/field";
import {Bound} from "../util/bound";

//碰撞冲突
export class Collision {
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] { return []; }
}

//无检测机制
export class NullCollision {
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        //没有任何检测逻辑，直接原样返回
        return features;
    }
}

//简单碰撞冲突  距离判断
export class SimpleCollision {
    public distance: number = 50; //pixel
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        //根据距离聚合
        return features.reduce( (acc, cur) => {
            const item: any = acc.find((item: any) => {
                const distance = cur.geometry.distance(item.geometry, CoordinateType.Screen, ctx, projection);
                return distance <= this.distance;
            });
            if (!item) acc.push(cur);
            return acc;
        }, []); // [feature]
    }
}

//叠盖碰撞冲突  叠盖判断
export class CoverCollision {
    //已通过检测的标注的边界集合
    private _bounds: Bound[] = [];
    //判断边界碰撞时的buffer，buffer越小，标注越密
    public buffer: number = 10; //pixel
    test(features: Feature[], field: Field, symbol: SimpleTextSymbol, ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()): Feature[] {
        if (!field || !symbol) return [];
        this._bounds = [];
        //根据标注宽高的量算，得到标注的size，并和已通过检测的标注，进行边界的交叉判断，来决定是否可绘制该要素的标注
        return features.reduce( (acc, cur) => {
            const bound = cur.geometry.measure(cur.properties[field.name], ctx, projection, symbol);
            if (bound) {
                bound.buffer(this.buffer);
                const item = this._bounds.find( item => item.intersect(bound) );
                if (!item) {
                    acc.push(cur);
                    this._bounds.push(bound);
                }
            }
            return acc;
        }, []); // [feature]
    }
}