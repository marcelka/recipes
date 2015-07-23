import gulp from 'gulp';
import Firebase from 'firebase';
import firebaseUrl from './settings';

var firebaseRef = new Firebase(firebaseUrl);

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

gulp.task('upload-food', () => {
  var foodRef = firebaseRef.child('foods');
  var foods = {
    id1: Food('id1', 'banana', 386, 1.04, 20, 0.3, 3, 100),
    id2: Food('id2', 'strawberry', 158, 0.86, 6.7, 0.4, 1.9, 100),
    id3: Food('id3', 'milk', 258, 3.1, 4.75, 3.4, 0, 100),
    id4: Food('id4', 'butter', 3070, 0.85, 0.1, 82, 0, 100),
    id5: Food('id5', 'flour', 1500, 11.29, 73.06, 1.53, 3.2, 100),
    id6: Food('id6', 'egg', 669, 12.28, 0.66, 11.72, 0, 100),
    id7: Food('id7', 'dark chocolate', 2348, 9.7, 32, 41, 0.75, 100),
  };
  foodRef.update(foods);
});


gulp.task('upload-recipes', () => {

  var recipeRef = firebaseRef.child('recipes');

  const getRandomRecipe = () => {
    const randomChoice = (lst) => lst[Math.floor(Math.random() * lst.length)];
    var res = {ingredients: []};
    let foods = ['banana', 'strawberry', 'milk', 'butter', 'flour', 'egg', 'dark chocolate'];
    for (let i = 1; i < 8; i++) {
      res.ingredients.push({foodId: `id${i}`, amount: Math.floor((Math.random() * 1000))});
    }
    var attr = ['Delicious', 'Wonderfull', 'Juicy', 'Spicy', 'Hot', 'Icy'];
    res.title = randomChoice(attr) + ' ' + randomChoice(foods);
    return res;
  };

  for (let i = 0; i < 10; i++) {
    recipeRef.update({[`id${i}`]: getRandomRecipe()});
  }
});

gulp.task('boot-db', ['upload-food', 'upload-recipes']);
