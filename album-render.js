const grid = document.getElementById('album-grid');
const status = document.getElementById('album-status');

async function findAlbum(entry) {
  const normalize = text =>
    String(text || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]/g, "");

  const term = `${entry.artist} ${entry.album}`;

  const url = `https://itunes.apple.com/search?${new URLSearchParams({
    term,
    media: "music",
    entity: "album",
    country: "US",
    limit: "100"
  })}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Apple Music search failed");
  }

  const data = await response.json();

  const albums = data.results || [];

  const wantedArtist = normalize(entry.artist);
  const wantedAlbum = normalize(entry.album);

  const matches = albums.filter(result => {
    const artist = normalize(result.artistName);
    const album = normalize(result.collectionName);

    return (
      artist === wantedArtist &&
      (
        album === wantedAlbum ||
        album.startsWith(wantedAlbum)
      )
    );
  });

  return matches[0] || null;
}

function createCard(entry, result) {
  const article = document.createElement('article');
  article.className = 'album-card';

  const cover = document.createElement('div');
  cover.className = 'album-cover';
  const artwork = entry.artwork || result?.artworkUrl100;

  if (artwork) {
    const img = document.createElement('img');
    img.src = entry.artwork ? entry.artwork : artwork.replace(/100x100bb(?=\.)/, '600x600bb');
    img.alt = `${entry.album} album artwork`;
    img.loading = 'lazy';
    img.onerror = () => {
      img.remove();
      cover.classList.add('cover-unavailable');
      cover.textContent = 'artwork unavailable';
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
  } else {
    article.append(cover);
  }

  const title = document.createElement('h3');
  title.textContent = entry.album;
  const artist = document.createElement('p');
  artist.className = 'album-artist';
  artist.textContent = entry.artist;
  article.append(title, artist);

  const yearValue = entry.year || result?.releaseDate?.slice(0, 4);
  if (yearValue) {
    const year = document.createElement('span');
    year.className = 'album-year';
    year.textContent = String(yearValue);
    article.append(year);
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
  if (!grid || !Array.isArray(recommendedAlbums) || !recommendedAlbums.length) return;
  if (status) status.textContent = 'Finding album artwork…';

  const cards = await Promise.all(recommendedAlbums.map(async entry => {
    try {
      return createCard(entry, await findAlbum(entry));
    } catch (error) {
      console.warn(`Could not load artwork for ${entry.artist} - ${entry.album}:`, error);
      return createCard(entry, null);
    }
  }));

  grid.replaceChildren(...cards);
  if (status) status.hidden = true;
})();
