import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

/**
 * Some Test Helpers
 *
 */
var waitForEvent = function (eventName) {
  return function (editor) {
    //console.log("waiting for Event", eventName);
    return new Ember.RSVP.Promise(function (resolve, reject) {
      editor.one(eventName, resolve);
    });
  };
};
var waitForAction = function (actionName) {
  return function (editor) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var target = { actionResolver: resolve };
      editor.set(actionName, 'actionResolver');
      editor.set('targetObject', target);
    });

  };
};
var waitForReady = waitForEvent('editor-ready');
var waitForChange = waitForAction('on-change');
var setValueOnEditor = function (editor, value) {
    /**
     * This is a little wierd to work with the sometimes-async nature of ckeditor.
     * If it has loaded as an iframe, change events are async
     * If it has loaded inline, changes are sync.
     * So, we setup the promise before-hand, so we catch the event no matter what.
     */
    var promise = waitForChange(editor);
    editor.set('value', value);
    return promise;
  };
var component;

moduleForComponent('ember-ckeditor', 'Unit | Component | ember ckeditor', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(3);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
  return waitForReady(component).then(function () {
    assert.equal(component._editor.status, "ready");
  });
});



test('it sends a "change" action on change', function (assert) {
  assert.expect(1);
  var component = this.subject();
  this.render();
  var timeout = setTimeout(function () {
    assert.ok(false, "Test Timed Out, Action didn't fire");
  }, 1000);
  return waitForReady(component)
    .then(function () {
      return setValueOnEditor(component, "<p>Hi</p>");
    })
    .then(function (result) {
      clearTimeout(timeout);
      //FYI: ckeditor always adds a newline at the end of the output, so we trim() it to verify against input
      assert.equal(result.data.trim(), "<p>Hi</p>", "Action was fired, result has the data we set");
    });
});


test('it removes script and style tags', function (assert) {
  assert.expect(2);

  var component = this.subject();
  this.render();

  return waitForReady(component).then(function () {
    var p = waitForChange(component);
    component.set('value', "<p>Hi</p><script></script><style></style>");
    return p;
  })
    .then(function () {
      let value = component.get('value');
      assert.equal(value.match(/script/), null);
      assert.equal(value.match(/style/), null);
    });

});

test('it can be re-rendered before the editor is finished initializing', function (assert) {
  // ckeditor can't be destroyed before init has finished, otherwise it throws an exception.
  // This makes certain that we don't throw an exception during normal ember re-rendering.
  assert.expect(1);
  var component = this.subject();

  try {
    Ember.run(() => {
      this.render();
      component.rerender();
    });
    assert.ok(true);
  } catch (e) {
    console.log(e.stack);
    assert.ok(false, 'Exception thrown when re-rendering immediately');
  }

});
