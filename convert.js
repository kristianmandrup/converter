const JSON5 = require("json5");
const fs = require("fs");
const path = require("path");
const convert = require("xml-js");

// read directory
const fg = require("fast-glob");

const parse = (input) => {
  const json = JSON5.parse(input);
  const { name, body, description, prefix } = json;
  console.log("PARSE", { bl: body?.length, pl: prefix?.length });
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

module.exports = (pattern, options) => {
  const { output, print, dir, indent } = options;
  if (dir) {
    options.cwd = dir;
  }
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const entries = fg.globSync(patterns, options);
  console.log({ entries });
  console.log({ patterns, pattern, options });

  let snippetsObj = {};
  try {
    entries.forEach((entry) => {
      console.log(`converting: ${entry}`);
      const filePath = path.join(options.cwd, entry);
      console.log(`filePath: ${filePath}`);
      let ext = path.extname(filePath);
      let name = path.basename(entry, ext);
      let data = fs.readFileSync(filePath, "utf8");
      console.log(data);

      const decodeCDataOf = (elem) => elem.replace(/\//g, "");

      const textOf = (elem) => {
        return elem._text || decodeCDataOf(elem._cdata);
      };

      try {
        // data = convert.xml2json(data, { compact: false, spaces: 4 });
        data = convert.xml2json(data, { compact: true, spaces: 4 });
        console.log({ jsonData: data });
        const json = JSON.parse(data);
        console.log({ json });
        const jsonObj = {
          name
        };
        const snippet = json.snippet;
        const content = textOf(snippet.content);
        const description = textOf(snippet.description);
        const trigger = textOf(snippet.tabTrigger);
        // jsonObj.body = JSON.stringify(content.replace("\\\\", "\\"));
        jsonObj.body = content.replace("\\\\", "\\");
        jsonObj.description = description;
        jsonObj.prefix = trigger;

        console.log({ jsonObj });
        // todo: convert to format expected by atomizr
        data = JSON.stringify(jsonObj);
      } catch (e) {
        console.log("Skipping XML conversion");
      }
      console.log("JSON:", data);
      const snippetJson = parse(data);
      console.log({ snippetJson });
      if (print === true) {
        console.log("================================================");
        console.log(snippetJson);
        console.log("================================================");
        return;
      } else {
        if (snippetJson) {
          snippetsObj = {
            ...snippetsObj,
            ...snippetJson
          };
        }
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  if (print === true) {
    console.log("SKIP WRITING TO FILE");
    process.exit(0);
  }
  try {
    console.log("WRITING TO FILE", output);
    const json = JSON.stringify(snippetsObj, null, indent);
    console.log("FINAL", { json });
    fs.writeFileSync(output, json);
  } catch (error) {
    console.error(error);
  }
};
