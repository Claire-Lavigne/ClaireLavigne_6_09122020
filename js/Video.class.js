export default class Video {
  constructor(data) {
    this.id = data.id;
    this.photographerId = data.photographerId;
    this.tags = data.tags;
    this.likes = data.likes;
    this.date = data.date;
    this.price = data.price;
    this.video = data.video;
  }

  generateTitle() {
    let mediaTitle = this.video.split('_').join(' ').replace(/\.[^/.]+$/, '');
    return mediaTitle;
  }

  // Preview = Image in gallery
  generatePreview() {
    let title = this.video.slice(0, -3) + 'jpg';
    let image = `
      <img src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/${this.photographerId}/${title}" alt="${this.generateTitle()}">
    `;
    return image;
  }

  // View = Video in Modal
  generateView() {
    let video = `
      <video controls>
        <source src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/${this.photographerId}/${this.video}" type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    `;
    return video;
  }

}
