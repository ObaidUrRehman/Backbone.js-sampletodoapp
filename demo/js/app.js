/**
 * Sample backbone.js Todo App by Obaid ur Rehman
 */

$(function(){
    var app = {};

// Todo Model
    app.Todo = Backbone.Model.extend({

        defaults: function() {
            return {
                title: "Empty todo...",
                done: false
            };
        },

        toggle: function() {
            this.save({done: !this.get("done")});
        }
    });

// Todo Collection
    app.TodoList = Backbone.Collection.extend({

        model: app.Todo,

        localStorage: new Store("todo-store"),

        done: function() {
            return this.where({done: true});
        }
    });

// Todo Collection instance
    app.Todos = new app.TodoList;

// View for an individual todo item
    app.TodoView = Backbone.View.extend({

        tagName:  "li",

        events: {
            "click .toggle"                 : "toggleDone",
            "click button.edit"             : "edit",
            "click button.delete"           : "clear",
            "keypress .edit-mode input"     : "updateOnEnter"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.template = _.template($('#item-template').html());
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit-mode input');
            return this;
        },

        toggleDone: function() {
            this.model.toggle();
        },

        edit: function() {
            this.$el.addClass("editing");
            this.input.focus();
        },

        updateOnEnter: function(e) {
            if (e.keyCode == 13) {
                var value = this.input.val();
                if (!value) {
                    this.clear();
                } else {
                    this.model.save({title: value});
                    this.$el.removeClass("editing");
                }
            }
        },

        clear: function() {
            this.model.destroy();
        }

    });

// Main App View
    app.TodoApp = Backbone.View.extend({

        el: $("#todoapp"),

        events: {
            "keypress #new-todo":  "createOnEnter"
        },

        initialize: function() {
            this.input = this.$("#new-todo");
            this.listenTo(app.Todos, 'add', this.addOne);
            this.listenTo(app.Todos, 'reset', this.addAll);
            this.listenTo(app.Todos, 'all', this.render);
            this.footer = this.$('footer');
            this.main = $('#main');

            app.Todos.fetch();
        },

        render: function() {

            var done = app.Todos.done().length;

            if (app.Todos.length) {
                this.main.show();
                this.footer.show();
            } else {
                this.main.hide();
                this.footer.hide();
            }
        },

        addOne: function(todo) {
            var view = new app.TodoView({model: todo});
            this.$("#todo-list").append(view.render().el);
        },

        addAll: function() {
            Todos.each(this.addOne, this);
        },

        createOnEnter: function(e) {
            if (e.keyCode == 13) {
                if (!this.input.val()) return;
                app.Todos.create({title: this.input.val()});
                this.input.val('');
            }
        }
    });

   app.Main = new app.TodoApp;
});