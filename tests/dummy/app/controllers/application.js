import Ember from 'ember';

export default Ember.Controller.extend({
  text: "Hello world",

  actions: {
    textChanged(newValue) {
      this.set('text', newValue);
    }
  }
})
