import { Field } from "./field";
import { Feature } from "../element/feature";
import { GeometryType } from "../geometry/geometry";
export declare class FeatureClass {
    name: string;
    alias: string;
    description: string;
    private _type;
    private _fields;
    private _features;
    get type(): GeometryType;
    get features(): Feature[];
    get fields(): Field[];
    constructor(type: GeometryType);
    addFeature(feature: Feature): void;
    removeFeature(feature: Feature): void;
    clearFeatures(): void;
    addField(field: Field): void;
    removeField(field: Field): void;
    clearFields(): void;
    loadGeoJSON(data: any): void;
}
