/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-ckeditor',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/ckeditor/ckeditor.js');
  },

  contentFor: function(type, config) {
    if (type === 'vendor-prefix') {
      return "window.CKEDITOR_BASEPATH = '/assets/ckeditor/';";
    }
  },

  treeForPublic: function(tree) {
    return new Funnel(this.project.bowerDirectory + '/ckeditor', {
      srcDir: '/',
      // include: ['**/*.woff', '**/stylesheet.css'],
      destDir: '/assets/ckeditor'
    });
  }
};
