/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-ckeditor',

  included: function(app) {
    this._super.included(app);
    this.bowerDirectory = app.bowerDirectory;
    app.import(app.bowerDirectory + '/ckeditor/ckeditor.js');
  },

  contentFor: function(type, config) {
    if (type === 'head') {
      return "<script>window.CKEDITOR_BASEPATH = '/assets/ckeditor/';</script>";
    }
  },

  treeFor: function(type) {
    var originalTree = this._super.treeFor.call(this, type);

    if (type === 'vendor') {
      var extraAssets = new Funnel(this.bowerDirectory + '/ckeditor', {
        srcDir: '/',
        // include: ['**/*.woff', '**/stylesheet.css'],
        destDir: '/assets/ckeditor'
      });

      return mergeTrees([originalTree, extraAssets]);
    }

    return originalTree;
  }
};
