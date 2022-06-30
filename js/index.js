import Photographer from './Person.class.js';

const intro = document.querySelector('#introduction');
const main = document.querySelector('#introduction > section');
const nav = document.querySelector('nav ul');
const anchorNav = document.querySelector('#anchor-nav');
anchorNav.hidden = true;
let fullPathURL = window.location.href.split('#')[0];

// Fetch API
// = promise-based JavaScript API for making asynchronous HTTP requests to fetch ressources from server
fetch('./js/datas.json')
  // Transform the data into json
  .then(response => {
    return response.json();
  })
  // Get the results
  .then(data => {
    const photographers = data[0].photographers;

    photographers.forEach(data => {
      const photographer = new Photographer(data);
      main.innerHTML += photographer.generateArticle();
    });

    displayNav(photographers);
    window.addEventListener('scroll', scrollNav);
    window.addEventListener('popstate', filterArticles);
    anchorNav.addEventListener('click', (e) => {
      e.preventDefault();
      returnArticles();
      intro.scrollIntoView({ behavior: 'smooth' });
    });
  })
  .catch(error => { console.error('fetch error', error); });

const displayNav = (photographers) => {
  let tagsArray = [];
  photographers.forEach(photographer => {
    tagsArray.push(...photographer.tags); // add all tags into empty array
  });
  // remove duplicate tags
  // ('new') --> create new object 
  // ('Set') --> convert the array to a collection of unique values 
  // (spread operation '...') --> convert the result into an array 
  // then for each tag : create element
  [...new Set(tagsArray)].forEach(tag => {
    nav.innerHTML += `<li><a href="#${tag}" aria-label="tag ${tag}" class="tag ${tag}">#${tag}</a></li>`;
  });
};

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
    });
  }
  return;
};

const returnArticles = () => {
  window.history.pushState({}, '', fullPathURL);
  const articles = document.querySelectorAll('article');
  articles.forEach(article => {
    article.hidden = false;
  });
};