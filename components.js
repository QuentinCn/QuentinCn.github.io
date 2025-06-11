// Custom Article Component
class PortfolioArticle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || '';
        const description = this.getAttribute('description') || '';
        const image = this.getAttribute('image') || '';
        const link = this.getAttribute('link') || '#';

        this.shadowRoot.innerHTML = `
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
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const email = this.getAttribute('email') || '';
        const phone = this.getAttribute('phone') || '';
        const github = this.getAttribute('github') || '';
        const linkedin = this.getAttribute('linkedin') || '';

        this.shadowRoot.innerHTML = `
      <footer>
        <div class="inner">
          <ul class="icons">
            <li><a href="${github}" class="icon brands alt fa-github"><span class="label">GitHub</span></a></li>
            <li><a href="${linkedin}" class="icon brands alt fa-linkedin-in"><span class="label">LinkedIn</span></a></li>
            <li><a href="#" class="icon brands alt fa-envelope copyable" onclick="copyToClipboard('${email}', this); return false;"><span class="label">Email</span></a></li>
            <li><a href="#" class="icon brands alt fa-phone copyable" onclick="copyToClipboard('${phone}', this); return false;"><span class="label">Phone</span></a></li>
          </ul>
          <ul class="copyright">
            <li>&copy; Quentin Caniou</li>
            <li>Design: <a href="https://html5up.net">HTML5 UP</a></li>
          </ul>
        </div>
      </footer>
    `;
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