import { DateTime } from 'luxon';

export enum MealTime {
  Breakfast = 'breakfast',
  Snack = 'snack',
  Lunch = 'lunch',
  Dinner = 'dinner',
}

export interface MealBody {
  get mealTime(): MealTime;
  get description(): string;
  get kCal(): number;
  get intakeDateTime(): DateTime;
}

export interface Identifiable {
  get id(): string;
}

export interface Meal extends MealBody, Identifiable {}
