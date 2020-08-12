import { SimpleFillSymbol, SimpleLineSymbol, SimplePointSymbol } from "../symbol/symbol";
import { GeometryType } from "../geometry/geometry";
import { Color } from "../util/color";
export class ClassRendererItem {
}
export class ClassRenderer {
    constructor() {
        this._items = [];
    }
    get field() {
        return this._field;
    }
    get items() {
        return this._items;
    }
    //均分
    generate(featureClass, field, breaks) {
        this._field = field;
        this._items = [];
        const stat = featureClass.features.map(feature => feature.properties[field.name]).reduce((stat, cur) => {
            stat.max = Math.max(cur, stat.max);
            stat.min = Math.min(cur, stat.max);
            return stat;
        }, { min: 0, max: 0 });
        for (let i = 0; i < breaks; i++) {
            const item = new ClassRendererItem();
            switch (featureClass.type) {
                case GeometryType.Point:
                    const symbol1 = new SimplePointSymbol();
                    symbol1.fillStyle = Color.random().toString();
                    symbol1.strokeStyle = Color.random().toString();
                    item.symbol = symbol1;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case GeometryType.Polyline:
                    const symbol2 = new SimpleLineSymbol();
                    symbol2.strokeStyle = Color.random().toString();
                    item.symbol = symbol2;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case GeometryType.Polygon:
                    const symbol3 = new SimpleFillSymbol();
                    symbol3.fillStyle = Color.random().toString();
                    symbol3.strokeStyle = Color.random().toString();
                    item.symbol = symbol3;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i + 1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
            }
        }
    }
}
