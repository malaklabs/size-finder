# Size Finder Widget

A free, drop-in clothing size recommender for online stores.
Customers enter their height, weight and preferred fit, and the widget tells them their size.

- One `<script>` tag. No dependencies, no build step.
- English, French and Arabic (RTL) built in.
- Works inline or as a "Find my size" popup button.
- Use your own size chart.
- Auto-selects the size on your product page.

**[Live demo](https://malaklabs.github.io/size-finder/)**

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/malaklabs/size-finder@main/size-finder.js"></script>

<size-finder></size-finder>
```

Popup version, in French, with your brand color:

```html
<size-finder mode="button" lang="fr" accent="#0e3a73"></size-finder>
```

## Options

| Attribute   | Values                     | Default        |
|-------------|----------------------------|----------------|
| `lang`      | `en`, `fr`, `ar`           | `en`           |
| `mode`      | `inline`, `button`         | `inline`       |
| `accent`    | any CSS color              | `#111`         |
| `chart`     | JSON size chart (inline)   | built-in chart |
| `chart-src` | id of a `<script type="application/json">` holding the chart | |
| `target`    | CSS selector of a `<select>` or `<input>` to fill with the size | |

## Custom size chart

Each size has a height range (cm) and a weight range (kg):

```html
<script type="application/json" id="my-chart">
[
  { "size": "S",  "height": [155, 170], "weight": [48, 60] },
  { "size": "M",  "height": [165, 178], "weight": [58, 72] },
  { "size": "L",  "height": [172, 185], "weight": [70, 85] },
  { "size": "XL", "height": [178, 195], "weight": [83, 105] }
]
</script>

<size-finder chart-src="my-chart"></size-finder>
```

## Connect it to your product page

Fill a size `<select>` automatically:

```html
<select id="size"><option>S</option><option>M</option><option>L</option></select>
<size-finder mode="button" target="#size"></size-finder>
```

Or listen for the event:

```js
document.addEventListener('size-selected', (e) => {
  console.log(e.detail); // { size: "M", height: 172, weight: 68, fit: 0 }
});
```

## Styling

Override CSS variables on the element:

```css
size-finder {
  --sf-accent: #0e3a73;
  --sf-bg: #ffffff;
  --sf-tile: #f1eee9;
  --sf-radius: 24px;
}
```

## JavaScript API

```js
SizeFinder.recommend(SizeFinder.defaultChart, 175, 70, 0);
// → { size: "M", index: 2, between: null }
```

`fit`: `-1` slim, `0` regular, `1` loose.

## License

MIT. Free for personal and commercial use.

Built by [Malak Labs](https://www.instagram.com/malak_labs/). Need a custom store or widget? Send a DM.
