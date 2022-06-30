export default class Image {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.tags = data.tags;
    this.likes = data.likes;
    this.date = data.date;
    this.price = data.price;
    this.image = data.image;
  }

  generateTitle() {
    let mediaTitle = this.image.split('_').join(' ').replace(/\.[^/.]+$/, '');
    return mediaTitle;
  }

  // Preview = Image in gallery
  generatePreview() {
    let image = `
      <img src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/${this.photographerId}/${this.image}" alt="${this.generateTitle()}">
      `;
    return image;
  }
  
  // View = Image in Modal
  generateView() {
    return this.generatePreview();
  }
  
}
