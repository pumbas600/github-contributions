<picture>
    <source
        srcset="https://github.pumbas.net/api/contributions/pumbas600?bgColour=161B22"
        media="(prefers-color-scheme: dark)"
    />
    <img 
        src="https://github.pumbas.net/api/contributions/pumbas600?colour=002AFF&bgColour=F6F8FA"
        alt="pumbas600's Contributions"
    />
</picture>

# GitHub Contributions

This is a simple project that lets you to render your recent GitHub contributions as a graph that can be embedded in your README. To get started, simply paste this into your README and change `YOUR_GITHUB_USERNAME` to be your username (case-insensitive).

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
`days`          | The past number of days to include in your contributions graph | Positive number | `30`
`area`          | Whether to shade the area under the curve | `true` or `false` | `true`
`width`         | The width of the SVG in pixels  | Positive number | `1200`
`height`        | The height of the SVG in pixels | Positive number | `450`
`cache`         | The time in seconds a contribution graph can be cached for. A value of 0 can be used to disable caching of the response | Positive number | `300` (5 Minutes)

An example using some of these looks like:

```md
![YOUR_GITHUB_USERNAME's Contributions](https://github.pumbas.net/api/contributions/YOUR_GITHUB_USERNAME?colour=DF9149&bgColour=161B22&dotColour=D04E4E)
```

![pumbas600's Contributions](https://github.pumbas.net/api/contributions/pumbas600?colour=DF9149&bgColour=161B22&dotColour=D04E4E)

## Respecting User's Themes

GitHub has added support for the [`prefers-color-scheme` media query](https://github.blog/changelog/2022-05-19-specify-theme-context-for-images-in-markdown-beta/), which can be used in conjunction with the HTML [`<picture>`](https://www.w3schools.com/TAGS/tag_picture.asp) tags to allow you to change the image you display based on the user's theme.

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