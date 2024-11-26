### Compile the TypeScript Code

Compile the TypeScript code to JavaScript by running:

```
tsc extract_kotlin_code.ts
```

This will generate a JavaScript file (extract_kotlin_code.js) in the same directory.

### Run the Compiled JavaScript Code:

Run the compiled JavaScript code using Node.js:

```
npm run extract
```

A document called `extracted_code.txt` will be generated where you'll find the code grouped in less than 4000 chars. Trying not to split the classes in different groups if possible. This will help to share the code in the Copilot prompt.
