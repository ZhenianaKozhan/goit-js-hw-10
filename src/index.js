import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.6.min.css";
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('input#search-box'),
    list: document.querySelector('.country-list'),
    divInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
    evt.preventDefault();
    const name = evt.target.value.trim();
    if (name.length != 0) {
        fetchCountries(name)
            .then(data => {
                if (data.length > 4) {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                    refs.list.innerHTML = ""
                    refs.divInfo.innerHTML = ""
                    if (data) {
                        
                    }
                } return data;
            })
            .then(data => {
                if (data.length === 1) {
                    creatMarcupInfo(data[0])
                    refs.list.innerHTML = ""
                } else if (data.length > 2 && data.length < 10) {
                    createMarcupList(data)
                    refs.divInfo.innerHTML =""
                }
            })
            .catch(onError)
    }
}
  
function createMarcupList(data) {
    return refs.list.innerHTML = `
    <li class="item"><img src="${data[0].flags.svg}" alt="flag ${data[0].name.official}" width="20">  ${data[0].name.official}</li>
    <li class="item"><img src="${data[1].flags.svg}" alt="flag ${data[1].name.official}" width="20">  ${data[1].name.official}</li>
    <li class="item"><img src="${data[2].flags.svg}" alt="flag ${data[2].name.official}" width="20">  ${data[2].name.official}</li>
    <li class="item"><img src="${data[3].flags.svg}" alt="flag ${data[3].name.official}" width="20">  ${data[3].name.official}</li>
    `
};

function creatMarcupInfo({ flags, name, capital, population, languages }) {
    return refs.divInfo.innerHTML = `
    <span><img src="${flags.svg}" alt="flag ${name.official}" width="20">   ${name.official}</span>
    <p class="key">Capital: <span class="value">${capital}</span></p>
    <p class="key">Population: <span class="value">${population}</span></p>
    <p class="key">Languages: <span class="value">${Object.values(languages).join(', ')}</span></p>

    `
}

function onError(err) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}