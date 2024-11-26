const fs = require("fs");
const path = require("path");

// Define the main folder path
const mainFolder = "/Users/agus/Documents/Entorno/FollowApps/Android/MyTasks/app/src/main";

// Function to read files recursively
function readFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else if (filePath.endsWith(".kt")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Function to extract and clean code from a file
function extractCode(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");
  const cleanedLines = lines.filter((line) => !line.trim().startsWith("package") && !line.trim().startsWith("import") && !line.trim().startsWith("//"));
  // Join the cleaned lines back into a single string, remove extra spaces, and ensure each line ends with a newline character
  const cleanedContent = cleanedLines
    .join("\n")
    .replace(/\s{2,}/g, " ")
    .replace(/(.+)/g, "$1\n");
  return cleanedContent;
}

// Function to split content into groups of less than 4000 characters
function splitIntoGroups(content, maxGroupSize = 4000) {
  const groups = [];
  let currentGroup = "";
  let groupNumber = 1;

  content.forEach((fileContent) => {
    if (currentGroup.length + fileContent.length > maxGroupSize) {
      groups.push(`Group ${groupNumber}\n${currentGroup}`);
      currentGroup = "";
      groupNumber++;
    }
    currentGroup += `${fileContent}\n`;
  });

  if (currentGroup.length > 0) {
    groups.push(`Group ${groupNumber}\n${currentGroup}`);
  }

  return groups;
}

// Main function to process files and write to a single txt file
function main() {
  const kotlinFiles = readFilesRecursively(mainFolder);
  let extractedCode = [];

  kotlinFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    let fileContent = `\n// File: ${fileName}\n`;
    fileContent += extractCode(filePath);
    fileContent += "\n";

    if (fileContent.length > 4000) {
      const splitContent = splitIntoGroups([fileContent], 4000);
      extractedCode = extractedCode.concat(splitContent);
    } else {
      extractedCode.push(fileContent);
    }
  });

  const groups = splitIntoGroups(extractedCode, 4000);
  let finalContent = "";
  groups.forEach((group) => {
    finalContent += `${group}\n\n`;
  });

  fs.writeFileSync("extracted_code.txt", finalContent);
  console.log("Code extraction complete. Check extracted_code.txt");
}

main();
