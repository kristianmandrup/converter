const Atomizer = require("node-atomizr");
const fs = require("fs");
const path = require("path");
const toJSON = require("xml-json-format");

const xml =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<note importance="high" logged="true">' +
  "    <title>Happy</title>" +
  "    <todo>Work</todo>" +
  "    <todo>Play</todo>" +
  "</note>";

// read directory
const fg = require("fast-glob");

module.exports = (pattern, options) => {
  const jsonResult = toJSON(xml);
  console.log({ jsonResult });

  const { output, print, dir, indent } = options;
  if (dir) {
    options.cwd = dir;
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const entries = fg.globSync(patterns, options);
  console.log({ entries });
  console.log({ patterns, pattern, options });

  const snippetsObj = {};
  try {
    entries.forEach((entry) => {
      console.log(`converting: ${entry}`);
      const filePath = path.join(options.cwd, entry);
      console.log(`filePath: ${filePath}`);
      let data = fs.readFileSync(filePath, "utf8");
      console.log(data);
      data = data.replace("<![CDATA[", "");
      data = data.replace("\\$", "$");
      data = data.replace("]]>", "");
      console.log("cleaned:", data);
      try {
        data = toJSON(data);
        // todo: convert to format expected by atomizr
      } catch (e) {
        console.log("Skipping XML conversion");
      }
      console.log("JSON:", data);
      let convertedJsonStr = Atomizer.sublime2vscode(data);
      console.log("converted:", convertedJsonStr);
      const convertedObj = JSON.parse(convertedJsonStr);
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
