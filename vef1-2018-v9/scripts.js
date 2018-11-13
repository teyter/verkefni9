// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;

  function createlist(name, data) {
    if (data !== '') {
      const div = document.querySelector('.results');
      const dl = document.createElement('dl');
      div.appendChild(dl);
      const dt = document.createElement('dt');
      dl.appendChild(dt);
      dt.innerHTML = name;
      const dd = document.createElement('dd');
      dl.appendChild(dd);
      dd.innerHTML = data;
    }
  }
  function removelist() {
    const div = document.querySelector('.results');
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
  }

  function loading() {
    const results = document.querySelector('.results');
    const div = document.createElement('div');
    results.appendChild(div);
    const gif = document.createElement('img');
    const p = document.createElement('p');
    p.innerHTML = 'Leita af léni...';
    gif.setAttribute('src', 'loading.gif');
    div.classList.add('loading');
    div.appendChild(gif);
    div.appendChild(p);
  }

  function displayData(data) {
    removelist();
    if (data !== undefined) {
      const domain = 'Lén: ';
      createlist(domain, data.domain);

      let dateISO = new Date(data.registered);
      dateISO = dateISO.toISOString();
      const splitdate = dateISO.split('T');
      const registered = 'Skráð: ';
      createlist(registered, splitdate[0]);

      let changeISO = new Date(data.lastChange);
      changeISO = changeISO.toISOString();
      const splitchange = changeISO.split('T');
      const lastChange = 'Seinast breytt: ';
      createlist(lastChange, splitchange[0]);

      const registrantname = 'Skráningarapili: ';
      createlist(registrantname, data.registrantname);
      const email = 'Netfang: ';
      createlist(email, data.email);
      const address = 'Heimilsfang: ';
      createlist(address, data.address);
      const country = 'Land: ';
      createlist(country, data.country);
      const city = 'Borg: ';
      createlist(city, data.city);
      input.value = '';
    } else {
      const invalidText = document.createElement('p');
      document.querySelector('.results').appendChild(invalidText);
      invalidText.innerHTML = 'Lén er ekki skrá.';
      input.value = '';
    }
  }
  function getData(userInput) {
    const url = `${API_URL}${userInput}`;
    removelist();
    loading();
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) { 
        displayData(myJson.results[0]);
      })
      .catch(function(error) { 
        removelist();
        const div = document.querySelector('.results');
        const text = document.createElement('p');
        text.innerHTML = error;
        div.appendChild(text);
      });
  }
  function DomainSubmit(e) {
    e.preventDefault();
    if (input.value.trim() !== '') {
      getData(input.value);
    }
  }
  function init() {
    const form = document.querySelector('form');
    input = form.querySelector('input');

    form.addEventListener('submit', DomainSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
