const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")();

// Prompt the user to enter the main folder path and remove any single quotes
let mainFolder = prompt("Please enter the main folder path ('/Users/username/folder'): ");
mainFolder = mainFolder.replace(/'/g, "");

// Function to read files recursively
function readFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath, fileList);
    } else if (filePath.endsWith(".kt") || filePath.endsWith(".xml")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Function to extract and clean Kotlin code from a file
function extractKotlinCode(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");
  const cleanedLines = lines.filter((line) => !line.trim().startsWith("package") && !line.trim().startsWith("import") && !line.trim().startsWith("//"));
  const cleanedContent = cleanedLines
    .join("\n")
    .replace(/\s{2,}/g, " ")
    .replace(/(.+)/g, "$1\n");
  return cleanedContent;
}

// Function to extract and clean XML content from a file
function extractXMLContent(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  let cleanedContent = fileContent.replace(/<!--[\s\S]*?-->/g, "");
  cleanedContent = cleanedContent.replace(/<\?[\s\S]*?\?>/g, "");
  cleanedContent = cleanedContent.replace(/\s{2,}/g, " ").replace(/>\s+</g, "><");
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
  const files = readFilesRecursively(mainFolder);
  let extractedContent = [];

  files.forEach((filePath) => {
    const fileName = path.basename(filePath);
    let fileContent = `\nFile: ${fileName}\n`;
    if (filePath.endsWith(".kt")) {
      fileContent += extractKotlinCode(filePath);
    } else if (filePath.endsWith(".xml")) {
      fileContent += extractXMLContent(filePath);
    }
    fileContent += "\n";

    if (fileContent.length > 4000) {
      const splitContent = splitIntoGroups([fileContent], 4000);
      extractedContent = extractedContent.concat(splitContent);
    } else {
      extractedContent.push(fileContent);
    }
  });

  const groups = splitIntoGroups(extractedContent, 4000);
  let finalContent = "";
  groups.forEach((group) => {
    finalContent += `${group}\n\n`;
  });

  fs.writeFileSync("extracted_content.txt", finalContent);
  console.log("Content extraction complete. Check extracted_content.txt");
}

main();
