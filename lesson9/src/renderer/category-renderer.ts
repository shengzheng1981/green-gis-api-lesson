import {SimpleFillSymbol, SimpleLineSymbol, SimplePointSymbol, Symbol} from "../symbol/symbol";
import {Field} from "../data/field";
import {FeatureClass} from "../data/feature-class";
import {GeometryType} from "../geometry/geometry";
import {Color} from "../util/color";

 /**
 * 分类渲染项
 */
export class CategoryRendererItem {
    /**
     * 分类值
     */
    value: any;
    /**
     * 渲染符号
     */
    symbol: Symbol;
    /**
     * 分类标题（常用于图例中）
     */
    label: string;
    /**
     * 该类总数
     */
    count: number = 1;
}

 /**
 * 分类渲染
 * @remarks
 * 一般可通过设置分类字段，再调用generate自动生成分类渲染项
 * 也可通过手动添加和定义分类渲染项，完成分类渲染设置，通过items.push()
 */
export class CategoryRenderer {
    /**
     * 分类字段
     * @remarks
     * 一般为字符串字段，也可为枚举域值，或是非布尔值
     */
    _field: Field;
    /**
     * 所有分类集合
     */
    _items: CategoryRendererItem[] = [];
    /**
     * 分类字段
     * @remarks
     * 一般为字符串字段，也可为枚举域值，或是非布尔值
     */
    get field(): Field {
        return this._field;
    }
    /**
     * 所有分类集合
     */
    get items(): CategoryRendererItem[] {
        return this._items;
    }
    /**
     * 根据分类字段，自动生成分类渲染项
     * @param {FeatureClass} featureClass - 要素类（要素集合）
     * @param {Field} field - 分类字段
     */
    generate(featureClass: FeatureClass, field: Field) {
        this._field = field;
        this._items = [];
        //分类统计
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