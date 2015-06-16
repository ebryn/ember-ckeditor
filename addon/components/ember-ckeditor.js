import Ember from 'ember';
import layout from '../templates/components/ember-ckeditor';

export default Ember.Component.extend({
  layout: layout,
  'on-change': null,

  /**
   * CK Editor Instance
   */
  _editor: null,
  /**
   * Primary value. Bindable.
   * Still have a bit of magic to ensure events are fired when they should be
   */
  value: null,
  /**
   * Ferries any bound-in values into the editor.
   */
  _handleValueChange: Ember.observer('value', function () {
    if (this._editorChanging) {
      return;
    }
    if (this._editor) {
      this._editor.setData(this.get('value'));
    }
  }),

  /**
   * Skin that should be loaded.
   * Not Bindable.
   */
  skin: 'moono',
  /**
   * The content tags that are permitted in the editor. Null/default will let the plugins configure.
   * Note: If you remove the toolbar, you cannot use automatic content, and MUST specify it.
   * Not Bindable.
   */
  allowedContent: null,
  /**
   * The content tags that are not permitted, even if the auto-config says they're available.
   * Not Bindable.
   */
  disallowedContent: null,
  /**
   * ReadOnly mode
   */
  readOnly: false,
  /**
   * Build the config passed to ckeditor's init method
   * Ideal for over-writing in sub-classes
   * @returns {} ckeditor config
   */
  buildConfig: function () {
    var config = {
      skin: this.get('skin'),
      disallowedContent: this.get('disallowedContent'),
      readOnly: this.get('readOnly'),
      allowedContent: this.get('allowedContent')
    };

    return config;
  },
  _handleDidInsertElement: Ember.on('didInsertElement', function () {
    var editor = this._editor = this.$().ckeditor(this.buildConfig(), () => {
      if (editor !== this._editor) {
        //It's possible that the view re-rendered prior to the editor finished initializing.
        //If so, destroy this editor.
        editor.destroy(true);
      } else {
        editor.setData(this.get('value'), () => {
          this.trigger('editor-ready');
        });
      }
    }).editor;
    this._editor.on('change', this._handleChange.bind(this));
  }),
  _handleWillClearRender: Ember.on('willClearRender', function () {
    if (this._editor) {
      if (this._editor.status === 'ready') {
        //We can only destroy an editor that is ready.
        //We check for orphaned editors in the insertElement callback
        this._editor.destroy(true);
      }
      this._editor = null;
    }
  }),
  /**
   * Handles ckeditor change events, props them into the value object, sends actions and events.
   * @param event
   * @private
   */
  _handleChange: function (event) {
    //We set a flag so we can disregard changes to 'value'
    this._editorChanging = true;
    try {
      var newValue = event.editor.getData();

      this.set('value', newValue);
      this.triggerAction({
        action: this.get('valueEdited'),
        actionContext: newValue
      });
      this.sendAction('on-change', {
        event: event,
        data: event.editor.getData()
      });
      this.trigger('valueChange', event.editor.getData());
    } catch (e) {
      Ember.logger.error("Error when handling scrivener change", e);
    } finally {
      this._editorChanging = false;
    }
  },
  /**
   * Private/test method to simulate pasting
   * From ckeditor/tests/_benderjs/ckeditor/static/tools.js#emulatePaste
   * @param content html that will be pasted into the document.
   * @private
   */
  _paste: function (content) {
    var ed = this._editor.editable();
    ed.fire('paste', {
      $: {
        ctrlKey: true
      }
    });
    ed.getDocument().$.execCommand('inserthtml', false, content);
  }
});
