[![pumbas600's Contributions](https://github.pumbas.net/api/contributions/pumbas600?bgColour=161B22#gh-dark-mode-only)](https://github.com/pumbas600/github-contributions#gh-dark-mode-only)
[![pumbas600's Contributions](https://github.pumbas.net/api/contributions/pumbas600?colour=002AFF&bgColour=F6F8FA#gh-light-mode-only)](https://github.com/pumbas600/github-contributions#gh-light-mode-only)


<div align="center">
    <h1>GitHub Contributions</h1>
    <img alt="Graphs generated last week" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.pumbas.net%2Fapi%2Fmetrics%3Fdays%3D7&query=%24.count&suffix=%20graphs&label=last%20week&labelColor=%235d5d5d" />
    <img alt="Graphs generated in total" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.pumbas.net%2Fapi%2Fmetrics&query=%24.count&suffix=%20graphs&label=in%20total&labelColor=%235d5d5d" />
</div>

### [View GitHub Contributions Playground](https://github.pumbas.net)

This is a simple project that lets you to render your recent GitHub contributions as a graph that can be embedded in your README.  To get started, have a look at the [Github Contributions Playground](https://github.pumbas.net) to quickly create and view your contributions graph.

All examples in this README can be simply pasted into your README with `YOUR_GITHUB_USERNAME` changed to be your username (case-insensitive).

```md
![YOUR_GITHUB_USERNAME's Contributions](https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME)
```

This can also be used in HTML images:

```html
<img src="https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME" alt="YOUR_GITHUB_USERNAME's Contributions"/>
```

It works through a simple API that generates an SVG which can be used as an image in markdown. It utilises the amazing chart library [recharts](https://www.npmjs.com/package/recharts) to generate the graph.

## Customisation

There is also support for a number of options which allow you to style the graph to your hearts content. Each option can be configured through the use of query parameters in the url.

> **Note**
> All colours are hexcodes without the starting '#'. E.g. `#4BB5FC` → `4BB5FC`.

Query Parameter | Description             | Type    | Default Value
----------------|-------------------------|---------|-----------------
`colour`        | The colour of the line and text. A partially transparent version of this colour is used for the shaded area and grid | Hexcode | `#4BB5FC`
`bgColour`      | The background colour of the graph | Hexcode or `transparent` | `transparent`
`dotColour`     | The colour of the dots for each day's contributions | Hexcode | `#E5E5E5`
`days`          | The past number of days to include in your contributions graph | Positive number that's ≤ 365 | `30`

An example using some of these looks like:

```md
![YOUR_GITHUB_USERNAME's Contributions](https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?colour=DF9149&bgColour=161B22&dotColour=D04E4E)
```

![pumbas600's Contributions](https://github.pumbas.net/api/contributions/pumbas600?colour=DF9149&bgColour=161B22&dotColour=D04E4E)

## Respecting User's Themes

It is recommended to use the [`#gh-light-mode-only` or `#gh-dark-mode-only`](https://github.blog/changelog/2021-11-24-specify-theme-context-for-images-in-markdown/) fragments so that you can change the styling based on the user's theme. They simply need to be appended to the end of markdown URLs and they will not be rendered unless their respective mode is active.

```md
<!-- Dark mode image -->
[![YOUR_GITHUB_USERNAME's Contributions](https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?bgColour=161B22#gh-dark-mode-only)](https://github.com/pumbas600/github-contributions#gh-dark-mode-only)


<!-- Light mode image -->
[![YOUR_GITHUB_USERNAME's Contributions](https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?colour=002AFF&bgColour=F6F8FA#gh-light-mode-only)](https://github.com/pumbas600/github-contributions#gh-light-mode-only)
```

> **Important**
> For some reason, it only works on the API URL in VS Code, To get it to behave correctly on GitHub, you need to wrap it in another URL with the fragment applied.

GitHub has also added support for the [`prefers-color-scheme` media query](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/), which can be used in conjunction with the HTML [`<picture>`](https://www.w3schools.com/TAGS/tag_picture.asp) tags to allow you to change the image you display based on the user's theme.

```html
<picture>
    <!-- Dark mode image -->
    <source
        srcset="https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?bgColour=161B22"
        media="(prefers-color-scheme: dark)"
    />
    <!-- Default, light mode image -->
    <img 
        src="https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?colour=002AFF&bgColour=F6F8FA"
        alt="YOUR_GITHUB_USERNAME's Contributions"
    />
</picture>
```