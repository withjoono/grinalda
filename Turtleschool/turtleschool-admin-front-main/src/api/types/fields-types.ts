export interface IMajorFieldData {
  id: number;
  name: string;
  mid_fields?: IMidFieldData[];
}

export interface IMidFieldData {
  id: number;
  name: string;
  major_field_id: number;
  minor_fields?: IMinorFieldData[];
  major_field?: IMajorFieldData;
}

export interface IMinorFieldData {
  id: number;
  name: string;
  mid_field_id: number;
  mid_field?: IMidFieldData;
}

export interface IGeneralFieldData {
  id: number;
  name: string;
}
