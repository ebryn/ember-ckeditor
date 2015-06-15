/* globals CKEDITOR */
import Ember from 'ember';
import layout from '../templates/components/ember-ckeditor';

export default Ember.Component.extend({
  layout: layout,

  _editor: null,

  didInsertElement() {
    let textarea = this.element.querySelector('.editor');
    this._editor = CKEDITOR.replace(textarea);
  },

  willDestroyElement() {
    this._editor.destroy();
    this._editor = null;
  }
});
