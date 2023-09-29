# Sublime snippets to VS Code CLI

Easily convert sublime snippet files to VS Code snippets.

# Usage

Follow instructions from help page

`subsnip2vsc -h`

## Examples

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
