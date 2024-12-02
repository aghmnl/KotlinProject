# Extract kotlin and xml code to use it as prompt in Copilot

This script is designed to streamline the process of preparing code for submission to Copilot by compressing it and splitting it into manageable parts. It removes unnecessary spaces and comments, ensuring that each part respects a maximum length of 4000 characters. The script also aims to keep code segments intact, avoiding splitting them across different parts whenever possible.

## How to run the script 

Run the compiled JavaScript code using Node.js:

#### For kotlin code

```
npm run kt
```

#### For xml code

```
npm run xml
```

### Folder path

When excecuted, it will request the main folder path. For example: `/Users/username/project/app/src/main` In Mac you can drag and drop the folder from the Finder into the Terminal to have the whole path written. Any `'` char will be removed from the path name. Remember that is requesting a folder path and not a file path.

### Resulting file

#### For kotlin code

A document called `extracted_kt.txt` will be generated in the same folder where this script is saved.

#### For xml code

A document called `extracted_xml.txt` will be generated in the same folder where this script is saved.
