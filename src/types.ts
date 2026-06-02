export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface BMIRecord {
  id: string;
  date: string;
  timestamp: number;
  weight: number;      // in kg
  height: number;      // in cm
  bmi: number;
  category: BMICategory;
}

export type ActiveTab = 'home' | 'history' | 'settings';

export interface BMIRange {
  min: number;
  max: number;
  name: BMICategory;
  colorClass: string;
  bgColorClass: string;
  textClass: string;
  description: string;
  tip: string;
}
