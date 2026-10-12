// Add new blog posts here. Each entry appears on blog.html.
// Example:
// { title: 'A few records worth hearing', date: '2026-10-12', excerpt: 'Notes on what I have been listening to.', url: 'posts/records.html' }
const posts = [];
const container = document.getElementById('posts');
if (container && posts.length) {
  container.replaceChildren();
  for (const post of posts) {
    const article = document.createElement('article');
    article.className = 'post';
    const content = document.createElement('div');
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.href = post.url;
    link.textContent = post.title;
    heading.append(link);
    const summary = document.createElement('p');
    summary.textContent = post.excerpt;
    content.append(heading, summary);
    const date = document.createElement('time');
    date.dateTime = post.date;
    date.textContent = new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'});
    article.append(content,date);
    container.append(article);
  }
}
