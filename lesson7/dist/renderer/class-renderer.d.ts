import { Symbol } from "../symbol/symbol";
import { Field } from "../data/field";
import { FeatureClass } from "../data/feature-class";
export declare class ClassRendererItem {
    low: number;
    high: number;
    symbol: Symbol;
    label: string;
}
export declare class ClassRenderer {
    private _field;
    private _items;
    get field(): Field;
    get items(): ClassRendererItem[];
    generate(featureClass: FeatureClass, field: Field, breaks: number): void;
}
