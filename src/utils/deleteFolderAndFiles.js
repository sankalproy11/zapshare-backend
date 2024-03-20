const fs = require("fs").promises;
const path = require("path");

async function deleteFolderAndFiles(folderPath) {
  try {
    // Read all files in the folder
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      // Build the full path for each file
      const fullPath = path.join(folderPath, file);
      // Delete the file
      await fs.unlink(fullPath);
    }
    // After deleting all files, remove the folder
    await fs.rmdir(folderPath);
    console.log(`Successfully deleted folder and its contents: ${folderPath}`);
  } catch (error) {
    console.error(`Error deleting folder and its contents: ${error.message}`);
  }
}

module.exports = deleteFolderAndFiles;
