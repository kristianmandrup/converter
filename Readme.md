# Sublime snippets to VS Code CLI

Easily convert sublime `xml` snippet files to VS Code `json` snippets.

# Quick start

Install locally or globally via a package manager of your choice.

Follow instructions from CLI help page. See example usage [below](#cli-usage-examples).

`subsnip2vsc -h`

## Conversion example

This tool can convert Sublime `xml` based snippet files to a VS Code `snippets.json` file. The tool aims to do 90% of the job with fine-tuning left to you.

`dollarsign.sublime-snippet`

```xml
<snippet>
	<content>
		<![CDATA[\${$0}]]>
	</content>
	<tabTrigger>g</tabTrigger>
	<scope>text.html.gsp</scope>
	<description>${}</description>
</snippet>
```

`gactionsubmit.sublime-snippet`

```json
<snippet>
	<content><![CDATA[
<g:actionSubmit value="${1:text}" action="${2:action}" ${3:onclick="${4:jsCode}"} />]]></content>
	<tabTrigger>gactionsubmit</tabTrigger>
	<scope>text.html.gsp</scope>
	<description>Generates a submit button that maps to a specific action</description>
</snippet>

```

Converted to a single VS Code `snippets.json` file

```json
{
  "dollarsign": {
    "body": "\\${$0}",
    "description": "${}",
    "prefix": "g"
  },
  "gactionsubmit": {
    "body": "\r\n<g:actionSubmit value=\"${1:text}\" action=\"${2:action}\" ${3:onclick=\"${4:jsCode}\"} >",
    "description": "Generates a submit button that maps to a specific action",
    "prefix": "gactionsubmit"
  }
}
```

From there here you can fine tune the snippet file to suit your preferences.

## CLI Usage examples

Convert all `*.tmSnippet` files in `snippets` folder and print output to screen

`subsnip2vsc convert snippets/*.tmSnippet` -p

Convert all `*.tmSnippet` files in current folder to default `snippets.json` file

`subsnip2vsc convert *.sublime-snippet`

Convert all `.sublime-snippet` files in folder and sub-folders of `snippets`.
Send output to `my-snippets.json` file

`subsnip2vsc convert snippets/**/*.sublime-snippet -o my-snippets.json`

## API usage

Using the API directly, lets you customize various aspects of the internal functionality.

```js
const { convert } = require("subsnip2vsc");
// using the APIlets you pass a single or multiple glob patterns
const patterns = ["**/*.*.sublime-snippet, ../*.tmSnippet"];

// extracts string from element (see xml-js npm package)
const textOf = (elem) => {
  // custom text extraction of element
};

// returns json string for converted entry
export const convertEntry = (entry, options) => {
  // custom convert entry logic
};

const printSnippetEntry = (snippetJson, options) => {
  // custom print file logic
};

const writeResultFile = (jsonStr, options) => {
  // custom write file logic
};

const options = {
  print: true,
  textOf,
  convertEntry,
  printSnippetEntry,
  writeResultFile
};
convert(patterns, options);
```

## Dev CLI example

The following example demonstrates how you can call the binary directly in development mode while setting the work directory to a location of your choice (used as relative location for searching, reading and writing files)

```bash
npx cross-env .\bin\subsnip2vsc convert sublime-snippets/**/*.sublime-snippet -d C:/Users/xxxx/source/repos/vsc-extensions
```
