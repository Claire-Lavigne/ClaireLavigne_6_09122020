import Media from './Media.class.js';

const dropdown = document.querySelector('.dropdown');
const sectionOne = document.querySelector('#photographer-infos');
const modal = document.querySelector('.modal');

const form = document.querySelector('form');
const modalTitle = document.querySelector('.modal-title');
const inputFirstname = document.querySelector('#first_name');
const inputLastname = document.querySelector('#last_name');
const inputEmail = document.querySelector('#email');
const inputMessage = document.querySelector('#your_message');
const lightbox = document.querySelector('.lightbox');
const gallery = document.querySelector('.gallery-wrapper');
let actualLightbox;
let fullPathURL = window.location.href.split('#')[0];

fetch('./js/datas.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const getUrlId = window.location.search.substr(4); // get id from url

    const photographersById = data[0].photographers.filter(photographer => {
      return photographer.id == getUrlId;
    });

    const mediasById = data[0].media.filter(media => {
      if (media.photographerId == getUrlId) {
        return media;
      }
    });

    const formatedMedias = mediasById.map(media => new Media(media));

    createProfile(photographersById);
    removeDropdownOption();
    sortGallery(formatedMedias);
    generateTotalLikes();
    generateTotalPrice(photographersById);
    closeModals();

  })
  .catch((error) => {
    console.log(error);
  });

const createProfile = (photographersById) => {
  let tagLink = '';
  const name = photographersById[0].name;
  const city = photographersById[0].city;
  const country = photographersById[0].country;
  const tagline = photographersById[0].tagline;
  const tags = photographersById[0].tags;
  const portrait = photographersById[0].portrait;

  tags.forEach((tag) => {
    tagLink += `<li><a href="./index.html#${tag}" aria-label="tag ${tag}" class="tag ${tag}">#${tag}</a></li>`;
  });

  const content = `
      <div class="photographer-infos">
        <h1>${name}</h1>
        <p>${city}, ${country}</p>
        <p>${tagline}</p>
        <div class="tags-container">
          <ul>
            ${tagLink}
          </ul>
        </div>
      </div>
      <button class="modal-btn btn" title="Contact Me">Contactez-moi</button>
      <img src="https://claire-lavigne.github.io/ClaireLavigne_6_09122020/assets/Photographers_ID_Photos/${portrait}" alt="${name}">
  `;

  sectionOne.innerHTML += content;

  modalTitle.innerHTML += `<br>${name}`;
  modalTitle.id = 'modal_title';
  modal.setAttribute('aria-labelledby', modalTitle.id);
  modal.setAttribute('title', `Contact me ${name}`);
};

const removeDropdownOption = () => {
  let dropdownOptions = document.querySelectorAll('.dropdown option:not(:checked)');
  let selectedOption = document.querySelector('.dropdown option:checked');

  selectedOption.style.display = 'none'; // hide selected one
  dropdownOptions.forEach(option => option.style.display = 'block'); // display all unselected
};

const createGalleryAndLightbox = (medias) => {
  gallery.innerHTML = '';
  lightbox.innerHTML = '';

  medias.forEach(media => {
    gallery.innerHTML += media.generateCard();
    lightbox.innerHTML += media.generateLightbox();
    // add smthg in datas.json :
    // media.alt = media.generateMediaTitle();
  });
};

const generateTotalLikes = () => {
  let likesCounter = document.querySelectorAll('.likesCounter');
  let totalLikes = document.querySelector('.totalLikes');

  let arr = [];
  likesCounter.forEach((counter) => {
    let number = parseInt(counter.textContent);
    arr.push(number);
  });
  let totalLikesCounter = arr.reduce((a, b) => a + b);
  totalLikes.innerHTML = `${totalLikesCounter}`;
};

const generateTotalPrice = (photographersById) => {
  let totalPrice = document.querySelector('.totalPrice');
  totalPrice.innerHTML = `${photographersById[0].price}€ / jour`;
};

const sortGallery = (medias) => {
  // @ts-ignore
  const dropdownOption = dropdown.options[dropdown.selectedIndex].innerHTML;
  let sortedMedias = [];
  switch (dropdownOption) {
  case 'Titre':
    sortedMedias = medias.sort((a, b) =>
      a.media.generateTitle().localeCompare(b.media.generateTitle())
    );
    console.log('Titre ', sortedMedias);
    break;
  case 'Date':
    sortedMedias = medias.sort((a, b) =>
      new Date(b.media.date).getTime() - new Date(a.media.date).getTime() // Timestamp
    );
    console.log('Date ', sortedMedias);
    break;
  default:
    sortedMedias = medias.sort((a, b) =>
      b.media.likes - a.media.likes
    );
    console.log('Popularité ', sortedMedias);
    break;
  }
  createGalleryAndLightbox(sortedMedias);
  addListeners(medias);
};


const workingLightbox = () => {
  actualLightbox = document.querySelector('.lightbox-content.active');
  const prevArrow = actualLightbox.children[2];
  const nextArrow = actualLightbox.children[3];
  document.querySelector('body').style.height = '100vh';
  document.querySelector('body').style.overflow = 'hidden';

  window.addEventListener('keydown', handleKeyLightbox);
  window.addEventListener('keyup', listenKey);

  // if actual lightbox has a previous lightbox element
  // keep arrow and add an href attribute to it
  if (actualLightbox.previousElementSibling != null) {
    prevArrow.style.display = 'flex';
    prevArrow.href = `${fullPathURL}#${actualLightbox.previousElementSibling.id}`;
    prevArrow.addEventListener('click', () => {
      prevLightbox();
    });
  } else {
    prevArrow.style.display = 'none';
  }

  // if actual lightbox has a next lightbox element
  // keep arrow and add an href attribute to it
  if (actualLightbox.nextElementSibling != null) {
    nextArrow.style.display = 'flex';
    nextArrow.href = `${fullPathURL}#${actualLightbox.nextElementSibling.id}`;
    nextArrow.addEventListener('click', () => {
      nextLightbox();
    });
  } else {
    nextArrow.style.display = 'none';
  }

  // close actual lightbox with accessibility (using tab and enter)
  if (actualLightbox) {
    const lightboxCloseBtn = actualLightbox.children[0];
    lightboxCloseBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        closeModalLightbox();
      }
    });
  }

};

// change active lightbox with class and css
const prevLightbox = () => {
  actualLightbox.style.display = 'none';
  actualLightbox.classList.remove('active');
  actualLightbox.previousElementSibling.style.display = 'block';
  actualLightbox.previousElementSibling.classList.add('active');
};
const nextLightbox = () => {
  actualLightbox.style.display = 'none';
  actualLightbox.classList.remove('active');
  actualLightbox.nextElementSibling.style.display = 'block';
  actualLightbox.nextElementSibling.classList.add('active');
};

// lightbox accessibility events with tab and enter
// code from https://stackoverflow.com/questions/50178419/how-can-restrict-the-tab-key-press-only-within-the-modal-popup-when-its-open
const handleKeyLightbox = (e) => {
  if (e.key === 'Tab') {
    let focusableLightbox = actualLightbox.querySelectorAll('a,button');
    if (focusableLightbox.length) {
      let first = focusableLightbox[0];
      let last = focusableLightbox[focusableLightbox.length - 1];
      let shift = e.shiftKey;
      if (shift) {
        if (e.target === first) { // shift-tab pressed on first element in dialog
          last.focus();
          e.preventDefault();
        }
      } else {
        if (e.target === last) { // tab pressed on last element in dialog
          first.focus();
          e.preventDefault();
        }
      }
    }
  }
};

// lightbox accessibility events with arrows and escape
const listenKey = (e) => {
  actualLightbox = document.querySelector('.lightbox-content.active');
  const prevArrow = actualLightbox.children[2];
  const nextArrow = actualLightbox.children[3];

  if (e.key === 'ArrowLeft' && prevArrow.style.display != 'none') {
    window.removeEventListener('keyup', listenKey);
    prevArrow.click();
  }
  if (e.key === 'ArrowRight' && nextArrow.style.display != 'none') {
    window.removeEventListener('keyup', listenKey);
    nextArrow.click();
  }

  if (e.key === 'Escape') {
    window.removeEventListener('keyup', listenKey);
    closeModalLightbox();
  }
};

// code from https://stackoverflow.com/questions/50178419/how-can-restrict-the-tab-key-press-only-within-the-modal-popup-when-its-open
const handleKeyModal = (e) => {

  if (e.key === 'Tab') {
    let focusableLightbox = modal.querySelectorAll('input,button');
    if (focusableLightbox.length) {
      let first = focusableLightbox[0];
      let last = focusableLightbox[focusableLightbox.length - 1];
      let shift = e.shiftKey;
      if (shift) {
        if (e.target === first) { // shift-tab pressed on first element in dialog
          last.focus();
          e.preventDefault();
        }
      } else {
        if (e.target === last) { // tab pressed on last element in dialog
          first.focus();
          e.preventDefault();
        }
      }
    }
  }
};


const closeModals = () => {
  window.addEventListener('click', (event) => {
    if (
      event.target.classList == 'lightbox' ||
      event.target.classList == 'icon-close' ||
      event.target.classList == 'modal' ||
      event.target.classList == 'icon-close'
    ) {
      closeModalForm();
      closeModalLightbox();
    }
  });

  const formCloseBtn = document.querySelector('.modal-close');
  formCloseBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      closeModalForm();
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      closeModalForm();
    }
  });
};

const closeModalForm = () => {
  modal.style.display = 'none';
  window.removeEventListener('keydown', handleKeyModal);
};

const closeModalLightbox = () => {
  lightbox.style.display = 'none';
  document.querySelector('body').style.height = '100%'; // prevent scroll
  document.querySelector('body').style.overflow = 'unset'; // prevent scroll
  window.history.pushState({}, '', fullPathURL);
  window.removeEventListener('keydown', handleKeyLightbox);
};

const validateFormInput = (input) => {
  if (input.value.toString().trim().length < 2) {
    input.parentElement.setAttribute('aria-invalid', 'true');
    return false;
  } else {
    input.parentElement.setAttribute('aria-invalid', 'false');
    return true;
  }
};

const validateForm = (event) => {
  let isFormOk = [];
  event.preventDefault(); // disable redirect + keep form datas if invalid

  isFormOk.push(validateFormInput(inputFirstname));
  isFormOk.push(validateFormInput(inputLastname));
  isFormOk.push(validateFormInput(inputMessage));
  isFormOk.push(validateFormInput(inputEmail));

  // if form doesn't return any 'false'
  if (!isFormOk.includes(false)) {
    // get every valid keys/values
    let datas = new FormData(form);
    for (let entry of datas.entries()) {
      console.log(entry[0], ':', entry[1]);
    }
    modal.style.display = 'none';
    form.reset();
  }
};


const addListeners = (formatedMedias) => {
  
  const modalOpen = document.querySelector('.modal-btn');
  const buttonLikes = document.querySelectorAll('.likes');
  const mediasLink = document.querySelectorAll('.media-link');

  // contact form Modal with accessibility options
  modalOpen.addEventListener('click', () => {
    modal.style.display = 'block';
    document.querySelector('#first_name').focus();
    window.addEventListener('keydown', handleKeyModal);
  });
  form.addEventListener('submit', validateForm);
  window.addEventListener('popstate', workingLightbox);
  dropdown.addEventListener('change', () => {
    removeDropdownOption();
    sortGallery(formatedMedias);
  });

  buttonLikes.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.currentTarget.previousElementSibling.innerText++;
    generateTotalLikes();
  }));

  // show lightbox with current Img click
  mediasLink.forEach(link => {
    link.addEventListener('click', (e) => {
      const imgID = e.currentTarget.getAttribute('href').split('#').pop();

      lightbox.style.display = 'block';
      const lightboxes = Array.from(lightbox.children);
      lightboxes.forEach(item => {
        if (item.id === imgID) {
          item.style.display = 'block';
          item.classList.add('active');
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });
    });

  });
}
