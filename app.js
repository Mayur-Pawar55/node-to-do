const express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  sanitizer = require('sanitizer'),
  app = express(),
  port = 8000;

app.use(bodyParser.urlencoded({ extended: false }));

// Enable PUT/DELETE overrides
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

let todolist = [];

/* Display To-Do list */
app.get('/todo', function (req, res) {
  res.render('todo.ejs', {
    todolist,
    clickHandler: "func1();"
  });
});

/* Add new task */
app.post('/todo/add', function (req, res) {
  let newTodo = sanitizer.escape(req.body.newtodo);
  let priority = req.body.priority || 'low';

  if (newTodo && newTodo.trim() !== '') {
    todolist.push({
      text: newTodo.trim(),
      completed: false,
      priority
    });
  }
  res.redirect('/todo');
});

/* Delete task */
app.get('/todo/delete/:id', function (req, res) {
  if (req.params.id !== '') {
    todolist.splice(req.params.id, 1);
  }
  res.redirect('/todo');
});

/* Toggle complete */
app.get('/todo/complete/:id', function (req, res) {
  const todo = todolist[req.params.id];
  if (todo) {
    todo.completed = !todo.completed;
  }
  res.redirect('/todo');
});

/* Clear all completed tasks */
app.post('/todo/clearCompleted', function (req, res) {
  todolist = todolist.filter(t => !t.completed);
  res.redirect('/todo');
});

/* Edit task (GET form) */
app.get('/todo/edit/:id', function (req, res) {
  let todoIdx = req.params.id;
  let todo = todolist[todoIdx];

  if (todo) {
    res.render('edititem.ejs', {
      todoIdx,
      todo: todo.text,
      clickHandler: "func1();"
    });
  } else {
    res.redirect('/todo');
  }
});

/* Update task (PUT) */
app.put('/todo/edit/:id', function (req, res) {
  let todoIdx = req.params.id;
  let editTodo = sanitizer.escape(req.body.editTodo);

  if (todoIdx !== '' && editTodo !== '') {
    todolist[todoIdx].text = editTodo.trim();
  }
  res.redirect('/todo');
});

/* Default redirect */
app.use((req, res) => res.redirect('/todo'));

app.listen(port, function () {
  console.log(`✅ To-Do List running on http://0.0.0.0:${port}`);
});

module.exports = app;

