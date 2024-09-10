const { defineConfig } = require("cypress");
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Task for logging messages to the terminal
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },

        // Task for logging messages specifically to the terminal
        logToTerminal(message) {
          console.log(message);
          return null;
        },

        // Task to write content to a specified file
        writeToFile({ filePath, content }) {
          try {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully wrote to ${filePath}`);
            return null;
          } catch (err) {
            console.error(`Failed to write to ${filePath}:`, err);
            throw err;
          }
        }
      });
    }
  },
});
