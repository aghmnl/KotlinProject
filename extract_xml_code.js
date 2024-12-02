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
    } else if (filePath.endsWith(".xml")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Function to extract and clean XML content from a file
function extractXMLContent(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  // Remove XML comments
  let cleanedContent = fileContent.replace(/<!--[\s\S]*?-->/g, "");
  // Remove lines starting with <? and ending with ?>
  cleanedContent = cleanedContent.replace(/<\?[\s\S]*?\?>/g, "");
  // Remove unnecessary spaces
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
  const xmlFiles = readFilesRecursively(mainFolder);
  let extractedContent = [];

  xmlFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    let fileContent = `\nFile: ${fileName}\n`;
    fileContent += extractXMLContent(filePath);
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

  fs.writeFileSync("extracted_xml.txt", finalContent);
  console.log("XML content extraction complete. Check extracted_xml_content.txt");
}

main();
