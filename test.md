# This is a lmd test
Lets generate the example `main.js` file, with a hello world example.

```javascript "file:example/main.js"
// <<hello world definition>>

function main() {
  helloWorld()
}
```

Now, lets define the hello world function:

```javascript "hello world definition"
function helloWorld() {
  console.log("Hello, world!")
}
```

Perfect!

Don't forget to actually call the main function in the main file!

```javascript "file:example/main.js" +=
// main.js
main()
```
