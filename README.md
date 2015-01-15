# Concentration.js

An old card game written for the browser.
Running at [simonchaffetz.com/concentration-js][live demo]

![An Exciting Game of Concentration!](http://upload.wikimedia.org/wikipedia/commons/6/6d/Memory_%28game%29.JPG)

[live demo]: http://www.simonchaffetz.com/concentration-js

## Rules

[Wikipedia official][wikipedia]
[wikipedia]: http://en.wikipedia.org/wiki/Concentration_(game)#Rules

## Setup

The game logic starts in the file [concentration.js][concentration.js].

[concentration.js]: js/dev/concentration.js

This app uses [gulp][gulp] to concatenate JavaScript files and load them as a
single script in the index page. With [npm][npm] installed, run

```bash
  sudo npm install -g gulp
```

Then from the project root, run


```bash
  npm install
  gulp watch
```

`gulp watch` updates the concatenated JavaScript file whenever you make a change
to one of the source files.

[gulp]: http://gulpjs.com/
[npm]: https://www.npmjs.com/

## Promises

A lot of the game logic is asynchronous. The game waits for the player to pick a
card, then waits for them to pick another, and then waits for them to click a
third time to confirm the end of their turn. In regular JavaScript, this would
be callback hell.

Concentration.js uses [Q][q]'s promises to keep the code sane. For example check out the [turn loop][turn loop].

[q]: https://github.com/kriskowal/q
[turn loop]: js/dev/concentration.js
