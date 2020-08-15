import { CoordinateType } from "../geometry/geometry";
import { WebMercator } from "../projection/web-mercator";
//碰撞冲突
export class Collision {
    test(features, field, symbol, ctx, projection = new WebMercator()) { return []; }
}
export class NullCollision {
    test(features, field, symbol, ctx, projection = new WebMercator()) {
        return features;
    }
}
//简单碰撞冲突  距离判断
export class SimpleCollision {
    constructor() {
        this.distance = 50; //pixel
    }
    test(features, field, symbol, ctx, projection = new WebMercator()) {
        return features.reduce((acc, cur) => {
            const item = acc.find((item) => {
                const distance = cur.geometry.distance(item.geometry, CoordinateType.Screen, ctx, projection);
                return distance <= this.distance;
            });
            if (!item)
                acc.push(cur);
            return acc;
        }, []); // [feature]
    }
}
//叠盖碰撞冲突  叠盖判断
export class CoverCollision {
    constructor() {
        //drawn label bounds
        this._bounds = [];
    }
    test(features, field, symbol, ctx, projection = new WebMercator()) {
        if (!field || !symbol)
            return [];
        this._bounds = [];
        return features.reduce((acc, cur) => {
            const bound = cur.geometry.measure(cur.properties[field.name], ctx, projection, symbol);
            if (bound) {
                const item = this._bounds.find(item => item.intersect(bound));
                if (!item) {
                    acc.push(cur);
                    this._bounds.push(bound);
                }
            }
            return acc;
        }, []); // [feature]
    }
}
