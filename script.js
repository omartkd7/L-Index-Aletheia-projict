const API_URL = 'https://philosophersapi.com/api/philosophers';
const IMAGE_BASE = 'https://philosophersapi.com';

let allPhilosophers = [];

function renderCards(data) {
    const list = document.getElementById('philosophers-list');
    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = '<p class="error-text">Aucun philosophe trouvé.</p>';
        return;
    }

    list.innerHTML = '';
    data.slice(0, 8).forEach((philosopher) => {
        const card = document.createElement('div');
        card.className = 'philosopher-card';

        const imgPath = philosopher.images?.faceImages?.['face250x250'];
        const imgTag = imgPath
            ? `<img src="${IMAGE_BASE}${imgPath}" alt="${philosopher.name}" width="80">`
            : '';

        card.innerHTML = `
            ${imgTag}
            <h3>${philosopher.name}</h3>
            ${philosopher.life ? `<p class="phil-era">${philosopher.life}</p>` : ''}
            ${philosopher.school ? `<p class="phil-school">${philosopher.school}</p>` : ''}
            ${philosopher.topicalDescription ? `<p class="phil-desc">${philosopher.topicalDescription}</p>` : ''}
        `;

        list.appendChild(card);
    });
}

async function loadPhilosophers() {
    const list = document.getElementById('philosophers-list');
    if (!list) return;

    try {
        const response = await fetch(API_URL);
        allPhilosophers = await response.json();
        renderCards(allPhilosophers);
    } catch (error) {
        list.innerHTML = '<p class="error-text">Impossible de charger les philosophes pour le moment.</p>';
    }
}

function handleSearch() {
    const input = document.getElementById('search-input');
    const query = input.value.trim().toLowerCase();

    if (query === '') {
        renderCards(allPhilosophers);
        return;
    }

    const results = allPhilosophers.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        (p.school ?? '').toLowerCase().includes(query) ||
        (p.interests ?? '').toLowerCase().includes(query)
    );

    renderCards(results);

    const section = document.getElementById('PHILOSOPHERS');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('search-btn')?.addEventListener('click', handleSearch);

document.getElementById('search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
});

loadPhilosophers();
