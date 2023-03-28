import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const ulEL = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const countryName = e.target.value.trim();
  clearInput();
  fetchCountries(countryName)
    .then(data => {
      if (data.length === 1) {
        buildCountryMurkup(data);
      }

      if (data.length <= 10 && data.length > 1) {
        makeMurkup(data);
      }

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.status === 404) {
        e.target.value = '';
        let error = new Error(data.statusText);
        error.r = data;
        throw error;
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function makeMurkup(countries) {
  const murkup = countries
    .map(country => {
      return `<li style="display:flex; align-items:center; gap:10px">
        <img src="${country.flags.svg}" alt="${country.flags.alt}" width=50 height=30 />
        <p>${country.name.official}</p>
      </li>`;
    })
    .join('');

  ulEL.insertAdjacentHTML('beforeend', murkup);
}

function clearInput() {
    divEl.innerHTML = '';
    ulEL.innerHTML = '';
  }

function buildCountryMurkup(oneCountry) {
  const languagesArray = Object.values(oneCountry[0].languages);
  const murkup = oneCountry.map(country => {
    return `<img src ='${country.flags.svg}' width = 250px>
  <h1>${country.name.official}</h1>
  <p>Capital: ${country.capital}</p>
  <p>Population: ${country.population}</p>
  <p>Languages: ${languagesArray}</p>`;
  });

  divEl.insertAdjacentHTML('beforeend', murkup);
}


