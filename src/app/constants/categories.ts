import { Category } from '../models/category.model';

export const Categories: Category[] = [
  {
    name: 'Breakfast',
    type: 'breakfast',
    icon: 'assets/breakfast-icon.png',
    color: '#f2ecbd',
    count: 0,
  },
  { name: 'Lunch', type: 'lunch', icon: 'assets/lunch-icon.png', color: '#fef0dc', count: 0 },
  { name: 'Dinner', type: 'dinner', icon: 'assets/dinner-icon.png', color: '#f1f2e4', count: 0 },
  {
    name: 'Desserts',
    type: 'dessert',
    icon: 'assets/desserts-icon.png',
    color: '#f9ede8',
    count: 0,
  },
  {
    name: 'Vegetarian',
    type: 'vegetarian',
    icon: 'assets/vegetarian-icon.png',
    color: '#e4f7e7',
    count: 0,
  },
  { name: 'Salad', type: 'salad', icon: 'assets/salad-icon.png', color: '#dff7f1', count: 0 },
  { name: 'Soup', type: 'soup', icon: 'assets/soup-icon.png', color: '#f5ecbf', count: 0 },

  { name: 'Drink', type: 'drink', icon: 'assets/drink-icon.png', color: '#e4ecf0', count: 0 },
];
