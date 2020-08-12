import { SimpleFillSymbol, SimpleLineSymbol, SimplePointSymbol } from "../symbol/symbol";
import { GeometryType } from "../geometry/geometry";
import { Color } from "../util/color";
export class CategoryRendererItem {
    constructor() {
        this.count = 1;
    }
}
export class CategoryRenderer {
    constructor() {
        this._items = [];
    }
    get field() {
        return this._field;
    }
    get items() {
        return this._items;
    }
    generate(featureClass, field) {
        this._field = field;
        this._items = [];
        featureClass.features.map(feature => feature.properties[field.name]).forEach((value) => {
            const item = this._items.find(item => item.value == value);
            if (item) {
                item.count += 1;
            }
            else {
                const item = new CategoryRendererItem();
                switch (featureClass.type) {
                    case GeometryType.Point:
                        const symbol1 = new SimplePointSymbol();
                        symbol1.fillStyle = Color.random().toString();
                        symbol1.strokeStyle = Color.random().toString();
                        item.symbol = symbol1;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case GeometryType.Polyline:
                        const symbol2 = new SimpleLineSymbol();
                        symbol2.strokeStyle = Color.random().toString();
                        item.symbol = symbol2;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case GeometryType.Polygon:
                        const symbol3 = new SimpleFillSymbol();
                        symbol3.fillStyle = Color.random().toString();
                        symbol3.strokeStyle = Color.random().toString();
                        item.symbol = symbol3;
                        item.value = value;
                        this._items.push(item);
                        break;
                }
            }
        });
    }
}
