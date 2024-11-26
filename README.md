# Extract kotlin code to use it as prompt in Copilot

This script is designed to streamline the process of preparing code for submission to Copilot by compressing it and splitting it into manageable parts. It removes unnecessary spaces and comments, ensuring that each part respects a maximum length of 4000 characters. The script also aims to keep code segments intact, avoiding splitting them across different parts whenever possible.

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
