---
title: Partial Application for Beginners
excerpt: "Understanding partial application."
date: "2017-08-02"
---

## Why Use Partial Application?

Partial application is a core concept for writing DRY (Don't Repeat
Yourself) and expressive code. You can use partial application to
compose and create new functions, and turn code like this:

```js
function sortFilesByName() {
  /* … */
}

function sortFilesByType() {
  /* … */
}

function sortFilesByFilesize() {
  /* … */
}

function sortFilesByDate() {
  /* … */
}

<button onClick={() => sortFilesByName()}>Name</button>
<button onClick={() => sortFilesByType()}>Type</button>
<button onClick={() => sortFilesByFilesize()}>Filesize</button>
<button onClick={() => sortFilesByDate()}>Date</button>
```

into this:

```js
function sortFilesBy(prop) {
  /* … */
}

<button onClick={sortFilesBy('name')}>Name</button>
<button onClick={sortFilesBy('type')}>Type</button>
<button onClick={sortFilesBy('filesize')}>Filesize</button>
<button onClick={sortFilesBy('date')}>Date</button>
```

## Understanding Partial Application

Partial application is a computer science term that describes the process of
fixing some arguments to a function, which then returns a function of smaller
arity. So what does that actually mean?

### Expressions

In Javascript we can define functions a few ways. We can declare them:

```js
function add(x, y) {
  return x + y
}

console.log(add)
//=> ƒ add(x, y) { return x + y }
```

And we can use them as values, by defining them as expressions (function
expressions):

```js
const add = function (x, y) {
  return x + y
}

console.log(add)
//=> ƒ (x, y) { return x + y }
```

Function expressions enable us to pass functions around like any other value.
This means you can pass a function as an argument to another function
(e.g. `map(function () {})`), and return a function from a function:

```js
const fn = function () {
  return function (x) {
    return x
  }
}

fn()
//=> ƒ (x) { return x }

fn()(1)
//=> 1
```

This is a core feature of Javascript and it enables us to write incredibly clean 
and flexible code.

### Arity

Arity is a term that describes the number of arguments that a function takes. A
function which accepts zero arguments is a function of zero arity. A function that accepts
one argument, is a function of one arity, two arguments has an arity of two, and so on and so forth.

We can determine the arity of a function by using
[`Function.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length).

```js
add.length
//=> 2

(function (x, y) { return x + y }).length
//=> 2

(function (x) { return x }).length
//=> 1

(function () {}).length
//=> 0
```

### Closures

We know that we can use a function expression to return a function from a
function. We can make use of this behavior by returning functions that
"remember" values from the functions they were returned from. Sounds confusing,
but it is actually somewhat simple:

```js
const add = function add() {
  const x = 1

  return function innerFunction() {
    return x
  }
}

add()
//=> ƒ innerFunction() { return x }

add()()
//=> 1
```

The inner function (`innerFunction`) is passed `x` from the outer function and
remembers that value. This inner function is called a closure because it is
accessing data from the outer `add` function's environment. We can rewrite `add`
to return a closure which accepts another variable:

```js
const add = function add() {
  const x = 1

  return function innerFunction(y) {
    return x + y
  }
}

add()
//=> ƒ innerFunction(y) { return x + y }

add()(4)
//=> 5

add()(1)
//=> 2

add()(0)
//=> 1
```

And if we move `x` to be an argument, and drop the naming of `innerFunction`, we
get:

```js
const add = function add(x) {
  return function (y) {
    return x + y
  }
}

add(1)(1)
//=> 1

add(0)(0)
//=> 0
```

## Putting It Together

> Partial application is the process of fixing some arguments to a function, which then returns a function of smaller arity.

Because our `add` function from above returns a function, we can assign a
variable to the result of calling `add` with one argument:

```js
const add5 = add(5)
//=> ƒ (y) { return x + y }

add5(10)
//=> 15
```

The function `add5` calls `add`, and fixes (binds) the value `5` to `x`. `add`
returns the inner function, and replaces `x` with the fixed value: `ƒ (y) { return 5 + y }`.

When we do this, we have *partially applied* the function `add`. Which has
produced a function (`add5`) that we can use in different ways from the
original.

Now that we have a function that accepts one argument, we can pass this function
around to higher-order functions (functions that take functions as arguments) like `map`:

```js
[1, 2, 3].map(add5)
//=> [6, 7, 8]

// same as:
[1, 2, 3].map(function (y) { return 5 + y })
```

While the `add` and `add5` examples do a great job of explaining the "what" and
"how" of partial application, they fail to illustrate the "why". Let's move on
to some real-world examples.

## Real-World Example

Let's take a look at the example from the beginning of this article:

```js
function sortFilesByName() {
  /* … */
}

function sortFilesByType() {
  /* … */
}

function sortFilesByFilesize() {
  /* … */
}

function sortFilesByDate() {
  /* … */
}

<button onClick={() => sortFilesByName()}>Name</button>
<button onClick={() => sortFilesByType()}>Type</button>
<button onClick={() => sortFilesByFilesize()}>Filesize</button>
<button onClick={() => sortFilesByDate()}>Date</button>
```

Imagine we have a request to add sorting by a new field: "Last Modified".
Instead of adding a new function `sortFilesByLastModified`, we can take this as
an opportunity to refactor and simplify our code.

First, let's group these functions into a plain object whose keys will
represent the property we want to sort by, and values will be functions that
accept a list of files to filter:

```js
const SortBy = {
  name: function (files) {
    // sort files
    return sortedFiles
  },

  size: function (files) {
    // sort files
    return sortedFiles
  },

  /* etc. */
}
```

I know that I want to create a single generic function instead of many `onClick`
handlers. This function should accept a property to filter on and return an
[event handler](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers):

```js
function sortFilesBy(property) {
  return function (event) {
    // ???
  }
}
```

We can use this function like so:

```js
<button onClick={sortFilesBy('name')}>Name</button>
<button onClick={sortFilesBy('type')}>Type</button>
<button onClick={sortFilesBy('filesize')}>Filesize</button>
<button onClick={sortFilesBy('date')}>Date</button>
```

When using this function we bind `property` to be whatever is passed in as an
argument, and return an event handler that `onClick` can fire. Now we need
to actually sort our files:

```js
function sortFilesBy(property) {
  return function (event) {
    const sort = SortBy[property]
    //=> ƒ (files) { return sortedFiles }

    this.setState(function (state) {
      return {
        files: sort(state.files)
      }
    })
  }
}
```

Because `property` is fixed to whatever value we supply the `sortFilesBy`
function, we can use it to look up our sorting function from within the `SortBy`
object. This example partially applies the `sortFilesBy` function to produce an
event handler that sorts files based on whatever is passed to `property`.

The benefit here is that instead of adding new functions to our React Component
(or whatever) we can add and remove functions to the `SortBy` object. This
reduces the amount of lines of code from the component. Even better, it decouples 
the logic of filtering, and managing state from the component. `SortBy` can now 
be reused throughout a codebase, where before it was tightly integrated into a 
specific component.

## Conclusion

This is just one of the many benefits of partially applying functions. Partial
application makes it easy to write [composable functions](https://leanpub.com/javascriptallongesix/read#leanpub-auto-compose-and-pipeline), clean code, and has a
whole load of other uses. I challenge you to find code in your own projects that could benefit from this
technique!
