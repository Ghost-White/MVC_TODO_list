jQuery(function() {
    'use strict';
    
    // 这里是一些工具函数的抽取，包括
    // 1.ID生成器
    // 2.显示格式化
    // 3.localStorage存储
    var Utils = {
        uuid : function() {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for ( i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize : function(count, word) {
            return count === 1 ? word : word + 's';
        },
        store : function(namespace, data) {
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        }
    };
    
    var Todo = function(id, title, completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    
    var App = {
        
        init: function() {
            this.ENTER_KEY = 13;
            this.todos = Utils.store('todos-jquery');
            this.cacheElements();
            this.bindEvents();
        },
        
        // 这里是缓存一些必要的dom节点，提高性能
        cacheElements: function() {
            this.todoTemplate = Handlebars.compile($('#todo-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.$todoApp = $('#todoapp');
            this.$header = this.$todoApp.find('#header');
            this.$main = this.$todoApp.find('#main');
            this.$footer = this.$todoApp.find('#footer');
            this.$newTodo = this.$header.find('#new-todo');
            this.$toggleAll = this.$main.find('#toggle-all');
            this.$todoList = this.$main.find('#todo-list');
            this.$count = this.$footer.find('#todo-count');
            this.$clearBtn = this.$footer.find('#clear-completed');
        },
        
        // 模拟Controller实现：所有的事件监听在这里绑定
        bindEvents: function() {
            var list = this.$todoList;
            this.$newTodo.on('keyup', this.create);
            this.$toggleAll.on('change', this.toggleAll);
            this.$footer.on('click', '#clear-completed', this.destroyCompleted);
            list.on('change', '.toggle', this.toggle);
            list.on('dblclick', 'label', this.edit);
            list.on('keypress', '.edit', this.blurOnEnter);
            list.on('blur', '.edit', this.update);
            list.on('click', '.destroy', this.destroy);
        },
        
        // 渲染记录列表：当模型数据发生改变的时候，对应的事件处理程序调用该方法，从而实现对应DOM的重新渲染
        render: function() {
            this.$todoList.html(this.todoTemplate(this.todos));
            this.$main.toggle(!!this.todos.length);
            this.$toggleAll.prop('checked', !this.activeTodoCount());
            this.renderFooter();
            Utils.store('todos-jquery', this.todos);
        },
        
        // 渲染底部
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.activeTodoCount();
            var footer = {
                activeTodoCount: activeTodoCount,
                activeTodoWord: Utils.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount
            };

            this.$footer.toggle(!!todoCount);
            this.$footer.html(this.footerTemplate(footer));
        },
        
        // 创建记录
        create: function (e) {
            var $input = $(this);
            var val = $.trim($input.val());

            if (e.which !== App.ENTER_KEY || !val) {
                return;
            }
            
            App.todos.push({
                id: Utils.uuid(),
                title: val,
                completed: false
            });

            // 记录添加后，通知重新渲染页面
            App.render();
        },
        
        // 其他业务逻辑函数
        edit: function() {},
        destroy: function() {}
        /* ... */
        
    }
    
    App.init();

}); 
