# Sublime snippets to VS Code CLI

Easily convert sublime `xml` snippet files to VS Code `json` snippets.

# Usage

Follow instructions from help page

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

## Usage examples

Convert all `*.tmSnippet` files in `snippets` folder and print output to screen

`subsnip2vsc snippets/*.tmSnippet` -p

Convert all `*.tmSnippet` files in current folder to default `snippets.json` file

`subsnip2vsc *.tmSnippet`

Convert all `.sublime-snippet` files in folder and sub-folders of `snippets`.
Send output to `my-snippets.json` file

`snippets/**/*.sublime-snippet -o my-snippets.json`

## Dev example

```bash
npx cross-env .\bin\subsnip2vsc convert sublime-snippets/**/*.sublime-snippet -d C:/Users/krma/source/repos/vsc-extensions
```
