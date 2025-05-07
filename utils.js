// utils.js - Utility functions
const fs = require('fs');
const path = require('path');

// Function to read bug and solution examples from a JSON file
const readBugExamples = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'bugExamples.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bug examples:", error);
    return [];
  }
};

// Function to save bug examples to JSON
const saveBugExample = (bug, solution) => {
  try {
    let examples = [];
    
    // Try to read existing examples
    try {
      examples = readBugExamples();
    } catch (e) {
      // File doesn't exist yet, start with empty array
    }
    
    // Add the new example
    examples.push({ bug, solution, timestamp: new Date().toISOString() });
    
    // Write to file
    fs.writeFileSync(
      path.join(__dirname, 'bugExamples.json'), 
      JSON.stringify(examples, null, 2), 
      'utf8'
    );
    
    return true;
  } catch (error) {
    console.error("Error saving bug example:", error);
    return false;
  }
};

module.exports = {
  readBugExamples,
  saveBugExample
};