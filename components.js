// Custom Article Component
class PortfolioArticle extends HTMLElement {
    async connectedCallback() {
        const title = this.getAttribute('title') || '';
        const description = this.getAttribute('description') || '';
        const image = this.getAttribute('image') || '';
        const link = this.getAttribute('link') || '#';

        // Load CSS (fallback if fetch fails)
        let cssText = '';
        try {
            const response = await fetch('assets/css/components/article.css');
            cssText = await response.text();
        } catch (e) {
            console.warn('Could not load article CSS:', e);
            cssText = `
                article { transition: transform 0.3s ease; }
                article:hover { transform: scale(1.02); }
                .image { display: block; width: 100%; height: auto; overflow: hidden; }
                .image img { width: 100%; height: auto; transition: transform 0.3s ease; }
                article:hover .image img { transform: scale(1.05); }
                header { padding: 1em; text-align: center; }
                h3 { margin: 0 0 0.5em 0; }
                p { margin: 0; color: #666; }
                a { text-decoration: none; color: inherit; }
            `;
        }

        this.shadowRoot.innerHTML = `
            <style>${cssText}</style>
            <article>
                <a href="${link}" class="link">
                    <span class="image">
                        <img src="${image}" alt="${title}" />
                    </span>
                    <header class="major">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </header>
                </a>
            </article>
        `;
    }
}

// Custom Footer Component
class PortfolioFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._styleSheet = null;
    }

    async connectedCallback() {
        const email = this.getAttribute('email') || '';
        const phone = this.getAttribute('phone') || '';
        const github = this.getAttribute('github') || '';
        const linkedin = this.getAttribute('linkedin') || '';

        // Load CSS if not already loaded
        if (!this._styleSheet) {
            try {
                const response = await fetch('assets/css/components/footer.css');
                const cssText = await response.text();
                this._styleSheet = new CSSStyleSheet();
                await this._styleSheet.replace(cssText);
            } catch (error) {
                console.error('Failed to load footer CSS:', error);
                this._styleSheet = new CSSStyleSheet();
                await this._styleSheet.replace(`
                    .inner { padding: 2em 0; text-align: center; }
                    .icons { list-style: none; padding: 0; display: flex; justify-content: center; gap: 1em; margin-bottom: 1em; }
                    .icons a { color: inherit; transition: color 0.3s ease; }
                    .icons a:hover { color: #4CAF50; }
                    .copyright { list-style: none; padding: 0; margin: 0; font-size: 0.8em; color: #666; }
                    .copyright li { display: inline; margin: 0 0.5em; }
                    .copyable { cursor: pointer; position: relative; }
                    .copyable::after { content: "Copy"; position: absolute; background: #333; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; top: -25px; left: 50%; transform: translateX(-50%); opacity: 0; transition: opacity 0.3s; }
                    .copyable:hover::after { opacity: 1; }
                    .copyable.copied::after { content: "Copied!"; background: #4CAF50; }
                `);
            }
        }

        this.shadowRoot.adoptedStyleSheets = [this._styleSheet];

        this.shadowRoot.innerHTML = `
            <footer>
                <div class="inner">
                    <ul class="icons">
                        <li><a href="${github}" class="icon brands alt fa-github"><span class="label">GitHub</span></a></li>
                        <li><a href="${linkedin}" class="icon brands alt fa-linkedin-in"><span class="label">LinkedIn</span></a></li>
                        <li><a href="#" class="icon brands alt fa-envelope copyable"><span class="label">Email</span></a></li>
                        <li><a href="#" class="icon brands alt fa-phone copyable"><span class="label">Phone</span></a></li>
                    </ul>
                    <ul class="copyright">
                        <li>&copy; Quentin Caniou</li>
                        <li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
                    </ul>
                </div>
            </footer>
        `;

        // Add event listeners properly
        this.shadowRoot.querySelector('.fa-envelope').addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(email, e.currentTarget);
        });

        this.shadowRoot.querySelector('.fa-phone').addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(phone, e.currentTarget);
        });
    }
}

// Register the custom elements
customElements.define('portfolio-article', PortfolioArticle);
customElements.define('portfolio-footer', PortfolioFooter);

// Copy to clipboard function (needs to be in global scope)
function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        element.classList.add('copied');
        setTimeout(() => element.classList.remove('copied'), 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Copied to clipboard: ' + text);
    });
}