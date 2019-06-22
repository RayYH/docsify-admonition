# docsify-admonition

Admonition plugin for [docsify](https://docsify.js.org/#/).

## Introduction
The docsify-admonition plugin is inspired by [docsify-plugin-flexible-alerts](https://github.com/zanfab/docsify-plugin-flexible-alerts) and [mkdocs-material](https://github.com/squidfunk/mkdocs-material).

## Usage

First, inlcude below essential files:
```html
<link rel="stylesheet" href="http://unpkg.com/docsify-admonition@1.0.0/build/admonition.css" />
<script src="http://unpkg.com/docsify-admonition@1.0.0/build/index.js"></script>
```

> You can use it locally if you want, these files are all in `build` dir.

Then you can use below syntax:

```markdown

> [!note][Header]
Note Content
>

> [!hint][Header]
Hint Content
>

> [!caution][Header]
Caution Content
>

> [!danger][Header]
Danger Content
>

> [!error][Header]
Error Content
>

> [!Attention][Header]
Attention Content
>
```
![default](./images/default.png)

## Configuration
As you can see, The default configuration will show lables like `note, hint` and so on. To hidden these lables, you need to do this:
```js
window.$docsify = {
      // ...
      admonition: {
        labelVisibility: 'hidden'
      }
      //, ...
}
```

After do that, you'll see:

![without-label](./images/without-label.png)

## License
MIT.