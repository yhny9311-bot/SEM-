export interface SemEffectData {
  Year: string;
  From: string;
  To: string;
  Type: '直接效应' | '间接效应' | '总效应';
  est: number;
}

export interface ChartDataPoint {
  year: string;
  [key: string]: string | number;
}
