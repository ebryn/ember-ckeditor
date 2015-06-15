/* globals CKEDITOR */
import Ember from 'ember';
import layout from '../templates/components/ember-ckeditor';

export default Ember.Component.extend({
  layout: layout,

  didInsertElement() {
    let textarea = this.element.querySelector('.editor');
    CKEDITOR.replace(textarea);
  }
});
