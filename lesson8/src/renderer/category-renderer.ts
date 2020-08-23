import {SimpleFillSymbol, SimpleLineSymbol, SimplePointSymbol, Symbol} from "../symbol/symbol";
import {Field} from "../data/field";
import {FeatureClass} from "../data/feature-class";
import {GeometryType} from "../geometry/geometry";
import {Color} from "../util/color";

export class CategoryRendererItem {
    value: any;
    symbol: Symbol;
    label: string;
    count: number = 1;
}
//分类渲染
export class CategoryRenderer {
    _field: Field;
    _items: CategoryRendererItem[] = [];

    get field(): Field {
        return this._field;
    }
    get items(): CategoryRendererItem[] {
        return this._items;
    }
    generate(featureClass: FeatureClass, field: Field) {
        this._field = field;
        this._items = [];
        featureClass.features.map(feature => feature.properties[field.name]).forEach( (value) => {
            const item = this._items.find(item => item.value == value);
            if (item) {
                item.count += 1;
            } else {
                const item = new CategoryRendererItem();
                switch (featureClass.type) {
                    case GeometryType.Point:
                        const symbol1: SimplePointSymbol = new SimplePointSymbol();
                        symbol1.fillStyle = Color.random().toString();
                        symbol1.strokeStyle = Color.random().toString();
                        item.symbol = symbol1;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case GeometryType.Polyline:
                        const symbol2: SimpleLineSymbol = new SimpleLineSymbol();
                        symbol2.strokeStyle = Color.random().toString();
                        item.symbol = symbol2;
                        item.value = value;
                        this._items.push(item);
                        break;
                    case GeometryType.Polygon:
                        const symbol3: SimpleFillSymbol = new SimpleFillSymbol();
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