const fs = require("fs");
const path = require("path");
const xml2js = require("xml-js");

// read directory
const fg = require("fast-glob");

const parse = (input) => {
  const json = JSON.parse(input);
  const { name, body, description, prefix } = json;
  return name && body?.length && prefix?.length
    ? {
        [name]: {
          body,
          description,
          prefix
        }
      }
    : undefined;
};

const decodeCDataOf = (elem) => elem.replace(/\//g, "");

const textOf = (elem) => {
  const content = elem._text || decodeCDataOf(elem._cdata);
  return content.replace("\\\\", "\\");
};

const convertEntry = (entry, options) => {
  const filePath = path.join(options.cwd, entry);
  if (!options.quiet) {
    console.log(`filePath: ${filePath}`);
  }
  let ext = path.extname(filePath);
  let name = path.basename(entry, ext);
  let data;
  try {
    data = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error(`Error reading file at ${filePath} : ${e.message}`);
    return;
  }

  try {
    data = xml2js.xml2json(data, { compact: true, spaces: 4 });
    const json = JSON.parse(data);
    const jsonObj = {
      name
    };
    options.textOf = options.textOf || textOf;
    const snippet = json.snippet;
    const content = options.textOf(snippet.content);
    const description = options.textOf(snippet.description);
    const trigger = options.textOf(snippet.tabTrigger);
    jsonObj.body = content;
    jsonObj.description = description;
    jsonObj.prefix = trigger;

    // todo: convert to format expected by atomizr
    data = JSON.stringify(jsonObj);
  } catch (e) {
    console.error(`Invalid XML: ${e.message}`);
  }
  return data;
};

const printSnippetEntry = (snippetJson, options) => {
  if (options.print !== true) return;
  console.log("================================================");
  console.log(snippetJson);
  console.log("================================================");
};

const writeResultFile = (jsonStr, options) => {
  const { output, dir } = options;
  try {
    if (!options.quiet) {
      console.log("WRITING TO", output);
    }
    const outFilePath = path.join(dir, output);
    fs.writeFileSync(outFilePath, jsonStr);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const convert = (pattern, options) => {
  const { print, dir, indent } = options;
  if (dir) {
    options.cwd = dir;
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const entries = fg.globSync(patterns, options);
  let snippetsObj = {};
  options.convertEntry = options.convertEntry || convertEntry;
  options.printSnippetEntry = options.printSnippetEntry || printSnippetEntry;
  options.writeResultFile = options.writeResultFile || writeResultFile;
  if (!entries?.length) {
    console.error(`No entries found matching: ${patterns.join(", ")}`);
    return;
  }
  try {
    entries.forEach((entry) => {
      const data = options.convertEntry(entry, options);
      if (!data?.length) {
        return;
      }
      const snippetJson = parse(data);
      if (!snippetJson && !options.quiet) {
        console.log(`invalid snippet file skipped: ${entry}`);
        return;
      }

      options.printSnippetEntry(entry, snippetJson, options);
      if (snippetJson) {
        snippetsObj = {
          ...snippetsObj,
          ...snippetJson
        };
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  const jsonStr = JSON.stringify(snippetsObj, null, indent);
  if (print === true) {
    console.log(jsonStr);
    process.exit(0);
  }
  options.writeResultFile(jsonStr, options);
};

module.exports = {
  convert,
  convertEntry,
  textOf,
  decodeCDataOf,
  printSnippetEntry,
  writeResultFile
};
