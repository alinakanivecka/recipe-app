export interface Nutrition {
  nutrients: Nutrient[];
}

export interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}
