/* globals CKEDITOR */
import Ember from 'ember';
import layout from '../templates/components/ember-ckeditor';

export default Ember.Component.extend({
  layout: layout,

  _editor: null,
  'on-change': null,

  didInsertElement() {
    let textarea = this.element.querySelector('.editor');
    let editor = this._editor = CKEDITOR.replace(textarea);
    editor.on('change', (e) => {
      this.sendAction('on-change', e.editor.getData());
    });
  },

  willDestroyElement() {
    this._editor.destroy();
    this._editor = null;
  }
});
