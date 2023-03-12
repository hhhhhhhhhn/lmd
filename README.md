# `lmd` - Literate Markdown
This project is a simple idea and a reference implementation
of a [Literate Programming System](https://en.wikipedia.org/wiki/Literate_programming) based on Markdown,
and inspired by [zyedidia's *Literate*](https://github.com/zyedidia/Literate).
The main idea is that, instead of creating a new document format,
`lmd` files are valid and readable Markdown
which require no additional processing to work as documents.

## The format
The `lmd` format works with *blocks*,
which are defined using the info string of fenced code blocks:

````
```javascript "hello world"
function hello() {
     console.log("hello world")
}
```
````

This will define a new block called `hello world`.
The programming language of the block does not matter.
You can append to it like this:

````
```javascript "hello world" +=
function callHelloTwice() {
     hello()
     hello()
}
```
````

You can embed a block inside another one by sorrounding it with `<<...>>`:

````
```javascript "main block"
// <<hello world>>

function main() {
    callHelloTwice()
}
```
````

The *entire line* is replaced by the block.
This allows you to use comments (as shown) to make sure the syntax highlighting does not break.

Block names starting with `file:` are written as files in the end.

The order in which blocks are defined is not important,
except for appending and redefinining.

See the [test file](./test.md) for reference.

## The implementation
The implementation of the format is not particularly fast or well done,
but it is very simple.
It takes the input from stdin and writes the files to the current directory.
Thankfully, thanks to the simplicity of the format,
using multiple files is as simple as using `cat`.
Try it locally by running:

```
yarn run run <test.md
```
