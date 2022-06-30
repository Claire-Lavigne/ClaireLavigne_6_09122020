export default class Photographer {
  constructor(data) {
    this.name = data.name;
    this.id = data.id;
    this.city = data.city;
    this.country = data.country;
    this.tags = data.tags;
    this.tagline = data.tagline;
    this.price = data.price;
    this.portrait = data.portrait;
  }

  generateArticle() {
    return `
    <article class="${this.generateTagsClass()}">
      <a href="./photographer.html?id=${this.id}" aria-label="${this.name}">
        <img src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/Photographers_ID_Photos/${this.portrait}" alt="">
        <h2>${this.name}</h2>
      </a>
      <div>
        <p>${this.city}, ${this.country}</p>
        <p>${this.tagline}</p>
        <p>${this.price}€/jour</p>
      </div>
      <div class="tags-container">
        <ul>
          ${this.generateTagsLink()}
        </ul>
      </div>
    </article>
    `;
  }

  generateTagsLink() {

    let tagLink = '';

    this.tags.forEach(tag => {
      tagLink += `<li><a href="#${tag}" aria-label="tag ${tag}" class="tag ${tag}">#${tag}</a></li>`;
    });

    return tagLink;
  }
  
  generateTagsClass() {

    let tagClass = '';

    this.tags.forEach(tag => {
      tagClass += `${tag} `;
    });

    return tagClass;
  }
}


