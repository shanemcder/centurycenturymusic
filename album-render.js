const grid = document.getElementById('album-grid');
const status = document.getElementById('album-status');

async function findAlbum(entry) {
  const term = `${entry.artist} ${entry.album}`;
  const url = `https://itunes.apple.com/search?${new URLSearchParams({term, entity:'album', limit:'25'})}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Catalog unavailable');
  const data = await response.json();
  const normalize = s => String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
  const exact = data.results.find(r => normalize(r.collectionName) === normalize(entry.album) && normalize(r.artistName).includes(normalize(entry.artist)));
  return exact || data.results.find(r => normalize(r.collectionName) === normalize(entry.album)) || null;
}

function createCard(entry, result) {
  const article = document.createElement('article');
  article.className = 'album-card';
  const cover = document.createElement('div');
  cover.className = 'album-cover';
  if (result?.artworkUrl100) {
    const img = document.createElement('img');
    img.src = result.artworkUrl100.replace(/100x100bb(?=\.)/, '600x600bb');
    img.alt = `${entry.album} album artwork`;
    img.loading = 'lazy';
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
  const title = document.createElement('h3'); title.textContent = entry.album;
  const artist = document.createElement('p'); artist.className = 'album-artist'; artist.textContent = entry.artist;
  article.append(title,artist);
  if (result?.releaseDate) {
    const year = document.createElement('span'); year.className = 'album-year'; year.textContent = result.releaseDate.slice(0,4); article.append(year);
  }
  if (entry.note) { const note = document.createElement('p'); note.className = 'album-note'; note.textContent = entry.note; article.append(note); }
  return article;
}

(async () => {
  if (!grid) return;
  if (!recommendedAlbums.length) return;
  status.textContent = 'Finding album artwork…';
  const cards = await Promise.all(recommendedAlbums.map(async entry => {
    try { return createCard(entry, await findAlbum(entry)); }
    catch { return createCard(entry, null); }
  }));
  grid.replaceChildren(...cards);
  status.hidden = true;
})();
