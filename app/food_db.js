function Food(id, name, kj, protein, carbohydrate, fat, fiber, grams=1) {
  return {
    'id': id,
    'name': name,
    'kj': kj / grams,
    'protein': protein / grams,
    'carbohydrate': carbohydrate / grams,
    'fat': fat / grams,
    'fiber': fiber / grams,
  };
}

export var foods = new Map([
  ['1', Food('1', 'banana', 386, 1.04, 20, 0.3, 3, 100)],
  ['2', Food('2', 'strawberry', 158, 0.86, 6.7, 0.4, 1.9, 100)],
  ['3', Food('3', 'milk', 258, 3.1, 4.75, 3.4, 0, 100)],
  ['4', Food('4', 'butter', 3070, 0.85, 0.1, 82, 0, 100)],
  ['5', Food('5', 'flour', 1500, 11.29, 73.06, 1.53, 3.2, 100)],
  ['6', Food('6', 'egg', 669, 12.28, 0.66, 11.72, 0, 100)],
  ['7', Food('7', 'dark chocolate', 2348, 9.7, 32, 41, 0.75, 100)],
]);

export function getFood(id) {
  return foods.get(id);
}
