const grid = document.getElementById('album-grid');
const status = document.getElementById('album-status');

const normalize = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
const cleanTitle = value => String(value || '').replace(/\s*\((?:deluxe|remaster(?:ed)?|expanded|anniversary|bonus|explicit|standard)[^)]*\)/gi, '').trim();

async function searchApple(term) {
  const url = `https://itunes.apple.com/search?${new URLSearchParams({ term, entity: 'album', limit: '200' })}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Apple catalog: ${response.status}`);
  return (await response.json()).results || [];
}

function chooseAlbum(results, entry) {
  const album = normalize(entry.album);
  const artist = normalize(entry.artist);
  const matching = results.filter(r => normalize(cleanTitle(r.collectionName)) === album);
  return matching.find(r => normalize(r.artistName) === artist) ||
    matching.find(r => normalize(r.artistName).includes(artist) || artist.includes(normalize(r.artistName))) || null;
}

async function findAppleAlbum(entry) {
  for (const term of [`${entry.artist} ${entry.album}`, entry.album]) {
    try {
      const result = chooseAlbum(await searchApple(term), entry);
      if (result) return {
        artwork: result.artworkUrl100?.replace(/\d+x\d+bb(?=\.)/, '600x600bb'),
        year: result.releaseDate?.slice(0, 4),
        link: result.collectionViewUrl
      };
    } catch (error) {
      console.warn('Apple lookup failed:', error);
    }
  }
  return null;
}

async function findMusicBrainzAlbum(entry) {
  try {
    const query = `releasegroup:"${entry.album.replace(/"/g, '')}" AND artist:"${entry.artist.replace(/"/g, '')}"`;
    const url = `https://musicbrainz.org/ws/2/release-group/?${new URLSearchParams({query, fmt:'json', limit:'10'})}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) return null;
    const groups = (await response.json())['release-groups'] || [];
    const group = groups.find(g => normalize(g.title) === normalize(entry.album) &&
      (g['artist-credit'] || []).some(a => normalize(a.name || a.artist?.name) === normalize(entry.artist)));
    if (!group) return null;
    return {
      artwork: `https://coverartarchive.org/release-group/${encodeURIComponent(group.id)}/front-500`,
      year: group['first-release-date']?.slice(0, 4),
      link: `https://musicbrainz.org/release-group/${encodeURIComponent(group.id)}`
    };
  } catch (error) {
    console.warn('MusicBrainz lookup failed:', error);
    return null;
  }
}

async function findAlbum(entry) {
  if (entry.artwork) return { artwork: entry.artwork, year: entry.year, link: entry.link };
  const apple = await findAppleAlbum(entry);
  if (apple?.artwork) return apple;
  return (await findMusicBrainzAlbum(entry)) || apple;
}

function createCard(entry, result) {
  const article = document.createElement('article');
  article.className = 'album-card';
  const cover = document.createElement('div');
  cover.className = 'album-cover';
  const unavailable = () => {
    cover.replaceChildren();
    cover.classList.add('cover-unavailable');
    cover.textContent = 'artwork unavailable';
  };
  if (result?.artwork) {
    const img = document.createElement('img');
    img.src = result.artwork;
    img.alt = `${entry.album} album artwork`;
    img.loading = 'lazy';
    img.onerror = unavailable;
    cover.append(img);
  } else unavailable();
  if (result?.link) {
    const link = document.createElement('a');
    link.href = result.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `View ${entry.album} album details`);
    link.append(cover);
    article.append(link);
  } else article.append(cover);
  const title = document.createElement('h3');
  title.textContent = entry.album;
  const artist = document.createElement('p');
  artist.className = 'album-artist';
  artist.textContent = entry.artist;
  article.append(title, artist);
  const yearText = entry.year || result?.year;
  if (yearText) {
    const year = document.createElement('span');
    year.className = 'album-year';
    year.textContent = String(yearText).slice(0, 4);
    article.append(year);
  }
  if (entry.note) {
    const note = document.createElement('p');
    note.className = 'album-note';
    note.textContent = entry.note;
    article.append(note);
  }
  return article;
}

(async () => {
  if (!grid || typeof recommendedAlbums === 'undefined' || !recommendedAlbums.length) return;
  if (status) status.textContent = 'Finding album artwork…';
  const cards = await Promise.all(recommendedAlbums.map(async entry => {
    try { return createCard(entry, await findAlbum(entry)); }
    catch (error) { console.warn('Album lookup failed:', entry, error); return createCard(entry, null); }
  }));
  grid.replaceChildren(...cards);
  if (status) status.hidden = true;
})();
