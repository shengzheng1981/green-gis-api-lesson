
export enum FieldType {
    String = 1,
    Number = 2,
}

export class Field {
    name: string;
    alias: string;
    type: FieldType;
    
}