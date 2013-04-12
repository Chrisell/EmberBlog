// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require handlebars-1.0.0-rc.3.js
//= require ember-1.0.0-rc.2.js
//= require ember-rest.js
//= require moment.js
//= require showdown.js
//= require_self

App = Ember.Application.create();

App.Post  = Ember.Resource.extend({
  resourceUrl:        '/posts',
  resourceName:       'post',
  resourceProperties: ['title', 'author', 'intro', 'extended', 'publishedAt'],

  validate: function() {
    if (this.get('first_name') === undefined || this.get('first_name') === '' ||
        this.get('last_name') === undefined  || this.get('last_name') === '') {
      return 'Contacts require a first and a last name.';
    }
  },

  fullName: Ember.computed(function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }).property('first_name', 'last_name')
});

App.Router.map(function() {
	this.resource('posts',function(){
		this.route('new');
		this.resource('post', { path: ':post_id' });
	});
	this.resource('about');
});

App.IndexRoute = Ember.Route.extend({
	redirect: function(){
		this.transitionTo('posts');
	}
})

// App.PostsRoute = Ember.Route.extend({
// 	model: function() {
// 		return App.Post.find();
// 	}
// });

// App.PostsNewRoute = Ember.Route.extend({
// 	model: function() {
// 		return App.Post.find();
// 	}
// });


// App.Post = DS.Model.extend({
// 	title: DS.attr('string'),
// 	author: DS.attr('string'),
// 	intro: DS.attr('string'),
// 	extended: DS.attr('string'),
// 	publishedAt: DS.attr('date')
// });

// App.Post.FIXTURES = [{
// 	id: 1,
// 	title: 'Hello World!',
// 	author: 'Chris Ell',
// 	publishedAt: new Date('4-4-2013'),
// 	intro: 'First shot at following along with the Build an App with Ember.js tutorial',
// 	extended: 'Ember seems interesting, but the learning curve needs to be evened out a bit.'
// }, {
// 	id: 2,
// 	title: 'Hi Everybody!',
// 	author: 'Dr. Nick',
// 	publishedAt: new Date('3-29-2013'),
// 	intro: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
// 	extended: 'Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.'
// }];

App.PostController = Ember.ObjectController.extend({
	isEditing: false,
	createTitle: 'Create New Blog Post',
	doneEditing: function(){
		this.set('isEditing', false);
	},
	edit: function(){
		this.set('isEditing', true);
		console.log(this);
	}
})

App.PostsNewController = Ember.ObjectController.extend({
	createTitle: 'Create New Blog Post',
	save: function(event) {
    var self = this;
    var post = this.get("post");

    event.preventDefault();

    post.saveResource()
      .fail( function(e) {
        App.displayError(e);
      })
      .done(function() {
        App.contactsController.pushObject(post);
        self.get("parentView").hideNew();
      });
  }
})

Ember.Handlebars.registerBoundHelper('date',function(date){
	return moment(date).fromNow();
});

var showdown = new Showdown.converter();
Ember.Handlebars.registerBoundHelper('markdown', function(input){
	return new Ember.Handlebars.SafeString(showdown.makeHtml(input));
});