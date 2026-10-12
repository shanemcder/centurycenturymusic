# Century Century

Static GitHub Pages website. The homepage and Products page remain unchanged; Blog now includes an introduction and album recommendations.

## Add an album

Open `albums.js` and add entries between the square brackets:

```js
const recommendedAlbums = [
  { artist: "Nicolas Jaar", album: "Space Is Only Noise", note: "A record I keep coming back to." },
  { artist: "The Strokes", album: "Is This It" },
];
```

The blog searches Apple's public iTunes album catalog in the visitor's browser, retrieves cover art and release years, and links the covers to Apple Music. This requires internet access. If an album is missing or the catalog is unavailable, a neutral placeholder appears instead of incorrect cover art. Check ambiguous album titles and deluxe/reissue editions for a correct match.

## Publish

Copy all files and the `assets` directory into the local GitHub Pages repository. Preserve the existing `CNAME` file. Commit and push via GitHub Desktop. Visit `blog.html` to see the journal.
