class LottoNumberDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                @keyframes reveal {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .lotto-number {
                    display: inline-block;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0 0.5rem;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    animation: reveal 0.5s ease-out forwards;
                }
            </style>
            <div id="numbers-container"></div>
        `;
    }

    getColorForNumber(number) {
        if (number <= 10) return '#fbcB0a'; // Yellow
        if (number <= 20) return '#4a90e2'; // Blue
        if (number <= 30) return '#d0021b'; // Red
        if (number <= 40) return '#7ed321'; // Green
        return '#8b572a'; // Brown
    }

    updateNumbers(numbers) {
        const container = this.shadowRoot.querySelector('#numbers-container');
        container.innerHTML = '';
        numbers.forEach((number, index) => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('lotto-number');
            numberElement.textContent = number;
            numberElement.style.backgroundColor = this.getColorForNumber(number);
            numberElement.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(numberElement);
        });
    }
}

customElements.define('lotto-number-display', LottoNumberDisplay);

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

const generateBtn = document.getElementById('generate-btn');
const lottoDisplay = document.querySelector('lotto-number-display');

generateBtn.addEventListener('click', () => {
    lottoDisplay.updateNumbers(generateLottoNumbers());
});

// Initial generation
lottoDisplay.updateNumbers(generateLottoNumbers());

const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

themeToggle.addEventListener('change', () => {
    root.setAttribute('data-theme', themeToggle.checked ? 'dark' : 'light');
});

// Set initial theme based on user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
    themeToggle.checked = true;
}

// Share functionality
const twitterBtn = document.getElementById('twitter-share-btn');
const facebookBtn = document.getElementById('facebook-share-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');

const pageUrl = window.location.href;
const shareText = "I just generated my lucky lotto numbers! Check it out: ";

twitterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
});

facebookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
});

copyLinkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(pageUrl).then(() => {
        const originalIcon = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = 'Copied!';
        setTimeout(() => {
            copyLinkBtn.innerHTML = originalIcon;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});
