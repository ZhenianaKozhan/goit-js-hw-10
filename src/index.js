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

    refs.list.innerHTML = ""
    refs.divInfo.innerHTML = ""

    if (name.length != 0) {
        fetchCountries(name)
            .then(data => {
                if (data.length > 10) {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                    refs.list.innerHTML = ""
                    refs.divInfo.innerHTML = ""
                } return data;
            })
            .then(data => {
                if (data.length === 1) {
                    refs.divInfo.innerHTML = creatMarcupInfo(data[0])
                    refs.list.innerHTML = ""
                } else if (data.length > 1 && data.length <= 10) {
                    refs.list.innerHTML = createMarcupList(data);
                    refs.divInfo.innerHTML =""
                } 
            })
            .catch(onError)
    }
}

function createMarcupList(countries) {
    return countries.map(({name, flags}) => `
    <li class="item"><img src="${flags.svg}" alt="flag ${name.official}" width="30"><b class="name">${name.official}</b></li>`).join("");
} 


function creatMarcupInfo({ flags, name, capital, population, languages }) {
    return  `
    <span class = "country"><img src="${flags.svg}" alt="flag ${name.official}" width="20">   ${name.official}</span>
    <p class="key"><b class="name">Capital:</b><span class="value">${capital}</span></p>
    <p class="key"><b class="name">Population:</b><span class="value">${population}</span></p>
    <p class="key"><b class="name">Languages:</b><span class="value">${Object.values(languages).join(', ')}</span></p>

    `
}

function onError(err) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
}