1. Unzip into your website folder (beside blog.html).
2. In Terminal, cd into that folder and run: python3 download_covers.py
3. Wait for the downloader to finish. It creates covers/ and album-artwork.js.
4. In blog.html, immediately BEFORE <script src="album-render.js"></script>, add:
   <script src="album-artwork.js"></script>
5. Commit all files including covers/ and push with GitHub Desktop.
6. Check missing-covers.txt for albums not downloaded; run again later to retry.

This method serves downloaded images directly from your GitHub Pages site, with no runtime API dependency.
