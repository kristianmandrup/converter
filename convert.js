const Atomizer = require("node-atomizr");
const fs = require("fs");

// read directory
const fg = require("fast-glob");

module.exports = (pattern, options) => {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const entries = fg.sync(patterns);
  const { output, print, indent } = options;
  const snippetsObj = {};
  try {
    entries.forEach((entry) => {
      console.log(`converting: ${entry}`);
      fs.readFile(entry, (error, data) => {
        if (error) throw error;

        let convertedJsonStr = Atomizer.sublime2vscode(data);
        let convertedObj = JSON.parse(convertedJsonStr);
        if (print === true) {
          console.log(output);
          return;
        } else {
          snippetsObj = {
            ...snippetsObj,
            ...convertedObj
          };
        }
      });
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  if (print === true) {
    process.exit(0);
  }
  try {
    const json = JSON.stringify(snippetsObj, null, indent);
    fs.writeFileSync(output, json);
  } catch (error) {
    console.error(error);
  }
};
