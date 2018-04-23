---
title: "Higher-Order Components (HOCs) for Beginners"
excerpt: "A gentle introduction to Higher-Order Components"
date: "2017-07-16"
---

## Preface

I'm writing this because every other article—including the official
React documentation on Higher-Order Components—confused the hell out of me as a
beginner. I understood that Higher-Order Components were a thing, but didn't
understand how they were useful. This article aims to clear up some of the
confusion about Higher-Order Components(HOCs).

Before we can understand HOCs we must first understand some things about
functions in Javascript.

## Brief Introduction to ES6 Arrow Functions

This article will provide examples solely using ES6 arrow functions. If you've
never seen an arrow function before, they are essentially equivalent to regular
function expressions. The code below shows the differences between regular
functions and arrow functions.

```js
function () {
  return 42
}

// same as:
() => 42

// same as:
() => {
  return 42
}

function person(name) {
  return { name: name }
}

// same as:
(name) => {
  return { name: name }
}
```

Read the [arrow function documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) for a more complete understanding.

## Functions as Values and Partial Application

Just like numbers, strings, booleans, etc., *functions are values*. That means
that you can pass functions around like any other data. You can pass a function
as an argument to another function:

```js
const execute = (someFunction) => someFunction()

execute(() => alert('Executed'))
```

And you can return a function from a function.

```js
const getOne = () => () => 1

getOne()()
```

The reason we have two `()` after `getOne` is that the first application of the
function returns another. To illustrate:

```js
const getOne = () => () => 1

getOne
//=> () => () => 1

getOne()
//=> () => 1

getOne()()
//=> 1
```

The helpful thing about returning functions from functions is that we can write
functions that keep track of their initial input. For example, the function
below accepts a number as an argument and returns a function that multiplies
that argument by a new one:

```js
const multiply = (x) => (y) => x * y

multiply(5)(20)
```

This example works the same as `getOne`, each parenthesis applies some input
to the function. In this case we are assigning `x` to `5` and `y` to `20`.

```js
const multiply = (x) => (y) => x * y

multiply
//=> (x) => (y) => x * y

multiply(5)
//=> (y) => 5 * y

multiply(5)(20)
//=> 5 * 20
```

When we call the function `multiply` with only one argument we are partially applying the function. When we call `multiply(5)` we get a function that will multiply it's input by 5. If we call `multiply(7)` we get a function that will multiply it's input by 7, and so on. We can use partial application to create new functions with a predefined input:

```js
const multiply = (x) => (y) => x * y

const multiplyByFive = multiply(5)
const multiplyBy100 = multiply(100)

multiplyByFive(20)
//=> 100
multiply(5)(20)
//=> 100

multiplyBy100(5)
//=> 500
multiply(100)(5)
//=> 500
```

This may not seem super useful at first. However, you can use partial application to write code that is easier to read and reason about. For example, we can replace [`styled-components`](https://www.styled-components.com/docs/basics#adapting-based-on-props) complex function interpolation syntax with something a bit cleaner.

```jsx
// before
const Button = styled.button`
  background-color: ${({ theme }) => theme.bgColor}
  color: ${({ theme }) => theme.textColor}
`

<Button theme={themes.primary}>Submit</Button>

// after
const fromTheme = (prop) => ({ theme }) => theme[prop]

const Button = styled.button`
  background-color: ${fromTheme("bgColor")}
  color: ${fromTheme("textColor")}
`

<Button theme={themes.primary}>Submit</Button>
```

We create a function that accepts a string as a parameter: `fromTheme("textColor")`, which returns a function accepting an object with a `theme` property: `({ theme }) => theme[prop]`, which we then attempt to lookup via the initial string we passed in `"textColor"`. We could go further and write functions like `backgroundColor` and `textColor` that partially apply the `fromTheme` function:

```jsx
const fromTheme = (prop) => ({ theme }) => theme[prop]
const backgroundColor = fromTheme("bgColor")
const textColor = fromTheme("textColor")

const Button = styled.button`
  background-color: ${backgroundColor}
  color: ${textColor}
`
```

## Higher-Order Functions

Higher-order functions are defined as functions that accept a function as an argument. You may already be familiar with higher-order functions if you've ever used a function like [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). If you aren't familiar with `map`, it is a function that loops over and applies a function to every element in an array. For example, you can square an array of numbers like so:

```js
const square = (x) => x * x

[1, 2, 3].map(square)
//=> [ 1, 4, 9 ]
```

We can write our own version of `map` to illustrate this concept:

```js
const map = (fn, array) => {
  const mappedArray = []

  for (let i = 0; i < array.length; i++) {
    mappedArray.push(
      // apply fn with the current element of the array
      fn(array[i])
    )
  }

  return mappedArray
}
```

We can then use our `map` to do something like square an array of numbers:

```js
const square = (x) => x * x

console.log(map(square, [1, 2, 3, 4, 5]))
//=> [ 1, 4, 9, 16, 25 ]
```

Or return an array of `<li>` React Elements:

```jsx
const HeroList = ({ heroes }) => (
  <ul>
    {map((hero) => (
      <li key={hero}>{hero}</li>
    ), heroes)}
  </ul>
)

<HeroList heroes=[
  "Wonder Woman",
  "Black Widow",
  "Spider Man",
  "Storm",
  "Deadpool"
]/>
/*=> (
  <ul>
    <li>Wonder Woman</li>
    <li>Black Widow</li>
    <li>Spider Man</li>
    <li>Storm</li>
    <li>Deadpool</li>
  </ul>
)*/
```

## Higher-Order Components

We know that a higher-order function is a function that accepts a function as an argument. In React, any function that returns [`JSX`](https://facebook.github.io/react/docs/jsx-in-depth.html) is known as a Stateless Functional Component, or Functional Component for short. A basic Functional Component looks like this:

```jsx
const Title = (props) => <h1>{props.children}</h1>

<Title>Higher-Order Components(HOCs) for React Newbies</Title>
//=> <h1>Higher-Order Components(HOCs) for React Newbies</h1>
```

A Higher-Order Component ==is a function that accepts a Component as an argument and returns a Component==. How you use the passed Component is up to you. You can even completely disregard it:

```jsx
// Technically an HOC
const ignore = (anything) => (props) => <h1>:)</h1>

const IgnoreHeroList = ignore(HeroList)
<IgnoreHeroList />
//=> <h1>:)</h1>
```

You can write an HOC that transforms it's input to uppercase:

```jsx
const yell = (PassedComponent) =>
  ({ children, ...props }) =>
    <PassedComponent {...props}>
      {children.toUpperCase()}!
    </PassedComponent>

const Title = (props) => <h1>{props.children}</h1>
const AngryTitle = yell(Title)

<AngryTitle>Whatever</AngryTitle>
//=> <h1>WHATEVER!</h1>
```

You can also return a Stateful Component, because classes in Javascript are syntax sugar for functions. This allows you to hook into React Lifecycle methods like `componentDidMount`. This is where HOCs become really useful. We can now do things like pass down the result of an HTTP request as props to a Functional Component.

```jsx
const withGists = (PassedComponent) =>
  class WithGists extends React.Component {
    state = {
      gists: []
    }

    componentDidMount() {
      fetch("https://api.github.com/gists/public")
      .then((r) => r.json())
      .then((gists) => this.setState({
        gists: gists
      }))
    }

    render() {
      return (
        <PassedComponent
          {...this.props}
          gists={this.state.gists}
        />
      )
    }
  }


const Gists = ({ gists }) => (
  <pre>{JSON.stringify(gists, null, 2)}</pre>
)

const GistsList = withGists(Gists)

<GistsList />
//=> Before api request finishes:
// <Gists gists={[]} />
// 
//=> After api request finishes:
// <Gists gists={[
//  { /* … */ },
//  { /* … */ },
//  { /* … */ }
// ]} />
```

You can call `withGists` on any component and it will pass down the result of the gists api call. You can see a more fleshed out example of this [here](https://codesandbox.io/embed/o2YpJnpDj).

## Conclusion: HOCs are 🔥🔥🔥

Redux uses an HOC, [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) to pass values from your application store to "connected" components. It also does some error checking and component lifecycle optimizations that, if done manually would cause you to write a ton of boilerplate code.

If you find yourself writing a lot of code in different places that does the same thing, you may be able to refactor that code into a reusable HOC.

HOCs are really expressive and you can build a lot of cool things with them.
However, because they are so expressive you can go overboard with them if you
want to.

Try to keep your HOCs simple, and ==aim to write code that doesn't require you to read
a long article to understand it==.

### Additional Exercises

Here are some exercises to solidify your understanding of HOCs:

- Write an HOC that reverses it's input
- Write an HOC that supplies data from an API to it's Passed Component
- Write an HOC that implements [`shouldComponentUpdate`](https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate) [to avoid reconciliation](https://facebook.github.io/react/docs/optimizing-performance.html#avoid-reconciliation).
- Write an HOC that uses [`React.Children.toArray`](https://facebook.github.io/react/docs/react-api.html#react.children.toarray) to sort the children passed to it's Passed Component.
