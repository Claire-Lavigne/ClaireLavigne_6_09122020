const container = document.querySelector('#introduction > section');
const array = [];
const nav = document.querySelector('nav');
const anchorNav = document.querySelector('#anchor-nav');
anchorNav.hidden = true;

// Fetch API
// = promise-based JavaScript API for making asynchronous HTTP requests to fetch ressources from server
fetch('./js/datas.json')
  // Transform the data into json
  .then(response => {
    return response.json()
  })
  // Get the results
  .then(data => {
    const photographers = data[0].photographers;

    photographers.forEach(photographer => {
      displayArticle(photographer)
      array.push(...photographer.tags); // add all tags into empty array
    })

    displayNav();
    window.addEventListener('scroll', scrollNav);
    window.addEventListener('hashchange', filterArticles);
    window.addEventListener('popstate', filterArticles()); // execute immediately
  })
  .catch(error => { console.log(error) })


const displayArticle = (photographer) => {
  let tagClass = '';
  let tagLink = '';

  photographer.tags.forEach(tag => {
    tagClass += `${tag} `;
    tagLink += `<a id="${tag}" href="#${tag}" aria-label="tag" class="tag">#${tag}</a>`;
  })

  const article = `
  <article class="${tagClass}">
    <a href="./photographer.html?id=${photographer.id}" aria-label="${photographer.name}">
      <img src="./assets/Photographers ID Photos/${photographer.portrait}" alt="">
      <h2>${photographer.name}</h2>
    </a>
    <div>
      <p>${photographer.city}, ${photographer.country}</p>
      <p>${photographer.tagline}</p>
      <p>${photographer.price}€/jour</p>
    </div>
    <div class="tags-container">
      ${tagLink}
    </div>
  </article>
  `;

  container.innerHTML += article;
}

const displayNav = () => {
  // remove duplicate tags
  // --> create new object ('new')
  // --> convert the array to a set ('Set' = collection of unique values)
  // --> convert the result into an array (spread operation '...')
  // then for each tag : create element
  [...new Set(array)].forEach(tag => {
    nav.innerHTML += `<a id="${tag}" href="#${tag}" aria-label="tag" class="tag">#${tag}</a>`
  })
}

const scrollNav = () => {
  const scrollY = window.scrollY;
  scrollY > 50 ? anchorNav.hidden = false : anchorNav.hidden = true;
};

const filterArticles = () => {
  const hash = window.location.hash;

  if (hash) {
    const tag = hash.replace('#', '');
    // if article has same class as the hash url keep it, if not hide it
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
      article.classList.contains(tag) ? article.hidden = false : article.hidden = true;
    })
  }
  return;
};