//字段类型
export enum FieldType {
    String = 1,
    Number = 2,
}

//字段
//TODO: a lot of things to be done
export class Field {
    name: string;
    alias: string;
    type: FieldType;
    
}