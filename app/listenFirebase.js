// Actions
export function createActions(dispatcher, firebaseRef) {
  return {
    getRecipes() {
      firebaseRef.child('recipes').on('value', (snapshot) => {
        dispatcher.dispatch('firebase', {'recipes': snapshot.val()});
      });
    },
    getFoods() {
      firebaseRef.child('foods').on('value', (snapshot) => {
        dispatcher.dispatch('firebase', {'foods': snapshot.val()});
      });
    },
  };
}
