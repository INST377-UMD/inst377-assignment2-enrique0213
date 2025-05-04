const breedMap = {};

if (annyang) {
  const commands = {
    'Load Dog Breed *breedName': (breedName) => {
      breedName = breedName.toLowerCase().replace(/[^a-z]/g, '');
      const breed = breedMap[breedName];
      if (breed) {
        displayBreedInfo(breed);
      }
    }
  };
  annyang.addCommands(commands);
}

fetch('https://dog.ceo/api/breeds/image/random/10')
  .then(res => res.json())
  .then(data => {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';

    data.message.forEach(img => {
      const imgTag = document.createElement('img');
      imgTag.src = img;
      imgTag.className = 'slider-img';
      carousel.appendChild(imgTag);
    });

    new Slider('#carousel', {
      loop: true,
      interval: 3000,
      autoplay: true
    });
  });

const API_URL = 'https://dogapi.dog/api/v2/breeds';

async function getTotalPages() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const lastPageUrl = data.links.last;
  const totalPages = parseInt(lastPageUrl.split('page[number]=')[1]);
  return totalPages;
}

async function getRandomBreedFromPage(pageNum) {
  const res = await fetch(`${API_URL}?page[number]=${pageNum}`);
  const data = await res.json();
  const breeds = data.data;
  if (!breeds || breeds.length === 0) return null;

  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  return randomBreed;
}

async function createRandomBreedButtons() {
  const container = document.getElementById('buttons-container');
  container.innerHTML = '';

  const totalPages = await getTotalPages();
  const selectedBreeds = [];

  for (let i = 0; i < 10; i++) {
    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    const breed = await getRandomBreedFromPage(randomPage);
    if (breed) selectedBreeds.push(breed);
  }

  selectedBreeds.forEach(breed => {
    const attr = breed.attributes;
    const key = attr.name.toLowerCase().replace(/[^a-z]/g, '');
    breedMap[key] = attr;

    const button = document.createElement('button');
    button.textContent = attr.name;

    button.addEventListener('click', () => {
      displayBreedInfo(attr);
    });

    container.appendChild(button);
  });
}

function displayBreedInfo(attr) {
  document.getElementById('breed-name').textContent = attr.name;
  document.getElementById('breed-description').textContent = attr.description;
  document.getElementById('min-life').textContent = attr.life?.min;
  document.getElementById('max-life').textContent = attr.life?.max;
  document.getElementById('dog-info').style.display = 'block';
}

window.onload = createRandomBreedButtons;
