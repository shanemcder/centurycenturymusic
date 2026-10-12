const grid = document.getElementById('album-grid');
const status = document.getElementById('album-status');

function normalize(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function findAlbum(entry) {
  const terms = [`${entry.artist} ${entry.album}`, entry.album];
  for (const term of terms) {
    try {
      const url = `https://itunes.apple.com/search?${new URLSearchParams({term, entity: 'album', limit: '100', country: 'US'})}`;
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      const exact = data.results?.find(r => normalize(r.collectionName) === normalize(entry.album) && normalize(r.artistName) === normalize(entry.artist));
      const close = data.results?.find(r => normalize(r.collectionName) === normalize(entry.album) && (normalize(r.artistName).includes(normalize(entry.artist)) || normalize(entry.artist).includes(normalize(r.artistName))));
      if (exact || close) return exact || close;
    } catch (_) { /* Try next query. */ }
  }
  return null;
}

function createCard(entry, result) {
  const article = document.createElement('article');
  article.className = 'album-card';
  const cover = document.createElement('div');
  cover.className = 'album-cover';
  const artwork = entry.artwork || result?.artworkUrl100?.replace(/100x100bb(?=\.)/, '600x600bb');
  if (artwork) {
    const img = document.createElement('img');
    img.src = artwork;
    img.alt = `${entry.album} album artwork`;
    img.loading = 'lazy';
    img.onerror = () => {
      if (entry.artwork && result?.artworkUrl100 && img.src !== result.artworkUrl100) {
        img.src = result.artworkUrl100.replace(/100x100bb(?=\.)/, '600x600bb');
      } else {
        img.remove();
        cover.classList.add('cover-unavailable');
        cover.textContent = 'artwork unavailable';
      }
    };
    cover.append(img);
  } else {
    cover.classList.add('cover-unavailable');
    cover.textContent = 'artwork unavailable';
  }
  if (result?.collectionViewUrl) {
    const link = document.createElement('a');
    link.href = result.collectionViewUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `View ${entry.album} in Apple Music`);
    link.append(cover);
    article.append(link);
  } else article.append(cover);
  const title = document.createElement('h3');
  title.textContent = entry.album;
  const artist = document.createElement('p');
  artist.className = 'album-artist';
  artist.textContent = entry.artist;
  article.append(title, artist);
  const year = entry.year || result?.releaseDate?.slice(0, 4);
  if (year) {
    const yearElement = document.createElement('span');
    yearElement.className = 'album-year';
    yearElement.textContent = year;
    article.append(yearElement);
  }
  if (entry.favoriteSong) {
    const favorite = document.createElement('p');
    favorite.className = 'album-note';
    favorite.textContent = `Favorite song: ${entry.favoriteSong}`;
    article.append(favorite);
  }
  return article;
}

(async () => {
  if (!grid || typeof recommendedAlbums === 'undefined' || !recommendedAlbums.length) return;
  if (status) status.textContent = 'Finding album artwork…';
  const cards = await Promise.all(recommendedAlbums.map(async entry => {
    try { return createCard(entry, await findAlbum(entry)); }
    catch (_) { return createCard(entry, null); }
  }));
  grid.replaceChildren(...cards);
  if (status) status.hidden = true;
})();
