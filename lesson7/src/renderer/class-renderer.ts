import {SimpleFillSymbol, SimpleLineSymbol, SimplePointSymbol, Symbol} from "../symbol/symbol";
import {Field} from "../data/field";
import {FeatureClass} from "../data/feature-class";
import {GeometryType} from "../geometry/geometry";
import {Color} from "../util/color";

export class ClassRendererItem {
    low: number;
    high: number;
    symbol: Symbol;
    label: string;
}
//分级渲染
export class ClassRenderer {
    private _field: Field;
    private _items: ClassRendererItem[] = [];

    get field(): Field {
        return this._field;
    }
    get items(): ClassRendererItem[] {
        return this._items;
    }

    //均分
    generate(featureClass: FeatureClass, field: Field, breaks: number) {
        this._field = field;
        this._items = [];
        const stat = featureClass.features.map(feature => feature.properties[field.name]).reduce((stat, cur) => {
            stat.max = Math.max(cur, stat.max);
            stat.min = Math.min(cur, stat.max);
            return stat;
        },{min: 0, max: 0});
        for(let i = 0; i < breaks; i++ ) {
            const item = new ClassRendererItem();
            switch (featureClass.type) {
                case GeometryType.Point:
                    const symbol1: SimplePointSymbol = new SimplePointSymbol();
                    symbol1.fillStyle = Color.random().toString();
                    symbol1.strokeStyle = Color.random().toString();
                    item.symbol = symbol1;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i+1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case GeometryType.Polyline:
                    const symbol2: SimpleLineSymbol = new SimpleLineSymbol();
                    symbol2.strokeStyle = Color.random().toString();
                    item.symbol = symbol2;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i+1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
                case GeometryType.Polygon:
                    const symbol3: SimpleFillSymbol = new SimpleFillSymbol();
                    symbol3.fillStyle = Color.random().toString();
                    symbol3.strokeStyle = Color.random().toString();
                    item.symbol = symbol3;
                    item.low = stat.min + i * (stat.max - stat.min) / breaks;
                    item.high = stat.min + (i+1) * (stat.max - stat.min) / breaks;
                    item.label = item.low + " - " + item.high;
                    this._items.push(item);
                    break;
            }
        }
    }
}