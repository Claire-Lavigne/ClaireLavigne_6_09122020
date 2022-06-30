import Image from './Image.class.js';
import Video from './Video.class.js';

export default class Media {
  constructor(data) {
    this.media = this.createMedia(data);
  }

  createMedia(data) {
    if (data.video) {
      return new Video(data);
    }
    return new Image(data);
  }

  generateCard() {
    let media = `
      <div class="media-wrapper">
        <a class="media-link" href="#${this.media.id}" title="${this.media.generateTitle()}, closeup view">
        ${this.media.generatePreview()}
        </a>
        <div class="media-infos">
          <div>${this.media.generateTitle()}</div> 
          <div>
            <span>${this.media.price}€</span>
            <span class="likesCounter">${this.media.likes}</span>
            <a class="likes" href=""><i aria-label="likes">❤</i></a>
          </div>
        </div>
      </div>
    `;

    return media;
  }

  generateLightbox() {
    let mediaLightbox = `
      <div id="${this.media.id}" class="lightbox-content">
        <button class="lightbox-close" title="Close dialog">
          <img class="icon-close" src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/cross-alt.png" alt="icon close">
        </button>
        <div class="lightbox-body">${this.media.generateView()}
          <div class="media-infos">${this.media.generateTitle()}</div>
        </div>
        <a class="lightbox__prev" title="Previous image">
          <img class="icon-prev" src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/prev.png" alt="previous arrow">
        </a>
        <a class="lightbox__next" title="Next image">
          <img class="icon-next" src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/next.png" alt="next arrow">
        </a>
      </div>
      `;
    return mediaLightbox;
  }
}


