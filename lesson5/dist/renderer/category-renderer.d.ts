import { Symbol } from "../symbol/symbol";
import { Field } from "../data/field";
import { FeatureClass } from "../data/feature-class";
export declare class CategoryRendererItem {
    value: any;
    symbol: Symbol;
    label: string;
    count: number;
}
export declare class CategoryRenderer {
    _field: Field;
    _items: CategoryRendererItem[];
    get field(): Field;
    get items(): CategoryRendererItem[];
    generate(featureClass: FeatureClass, field: Field): void;
}
