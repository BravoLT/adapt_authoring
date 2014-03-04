define(function(require){

  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var Origin = require('coreJS/app/origin');
  var OriginView = require('coreJS/app/views/originView');
  var EditorModel = require('coreJS/editor/models/editorModel');
  var EditorArticleView = require('coreJS/editor/views/editorArticleView');
  var EditorArticleCollection = require('coreJS/editor/collections/editorArticleCollection');

  var EditorPageView = OriginView.extend({

    tagName: 'div',

    className: 'page',

    events: {
      'click a.add-article' : 'addArticle',
      'click a.edit-page'   : 'loadPageEdit',
      'click a.delete-page' : 'deletePage'
    },

    preRender: function() {
      this.listenTo(this.model, 'sync', this.render);
      this.EditorArticleCollection = new EditorArticleCollection({_parentId:this.model.get('_id')});
      this.listenTo(this.EditorArticleCollection, 'sync', this.addArticleViews);
      this.EditorArticleCollection.fetch();
    },

    addArticleViews: function() {
      this.$('.page-articles').empty();

      _.each(this.EditorArticleCollection.models, function(article) {
        this.$('.page-articles').append(new EditorArticleView({model: article}).$el);
      }, this);
    },

    deletePage: function(event) {
      event.preventDefault();
      if (confirm('Are you sure you want to delete this page?')) {
        if (this.model.destroy()) {
          this.remove();
        }
      }
    },

    addArticle: function(event) {
      event.preventDefault();
      
      var thisView = this;
      var newPageArticleModel = new EditorModel({urlRoot: '/api/content/article'});

      newPageArticleModel.save({
        title: '{Your new article}',
        body: '{Edit this text...}',
        _parentId: thisView.model.get('_id')},
        {
          error: function() {
            alert('error adding new article');
          },
          success: function() {
            thisView.EditorArticleCollection.fetch();
          }
        }
      );
    },

    loadPageEdit: function (event) {
      event.preventDefault();
      Origin.trigger('editorSidebar:addEditView', this.model);
    }
    
  }, {
    template: 'editorPage'
  });

  return EditorPageView;

});
