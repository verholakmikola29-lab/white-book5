class App {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderCategories();
        this.renderContent();
        this.setupEventListeners();
        this.loadTheme();
        this.restoreLastScroll();
    }

    async loadData() {
        const res = await fetch('data.json');
        this.data = await res.json();
        this.filteredData = [...this.data];
    }

    renderContent(filterText = '') {
        const container = document.getElementById('content-grid');
        const sidebar = document.getElementById('sidebar');
        
        container.innerHTML = '';
        sidebar.innerHTML = '';

        this.filteredData.forEach(item => {
            // Генерація контенту з підсвіткою
            const section = this.createSectionElement(item, filterText);
            container.appendChild(section);

            // Генерація навігації
            const navLink = document.createElement('a');
            navLink.href = `#${item.id}`;
            navLink.textContent = item.title;
            sidebar.appendChild(navLink);
        });
    }

    createSectionElement(item, highlight = '') {
        const el = document.createElement('section');
        el.id = item.id;
        
        let contentHtml = item.content;
        if (highlight) {
            const regex = new RegExp(`(${highlight})`, 'gi');
            contentHtml = contentHtml.replace(regex, `<mark class="highlight">$1</mark>`);
        }

        el.innerHTML = `
            <div class="category">${item.category}</div>
            <h2>${item.title}</h2>
            <p>${contentHtml}</p>
            <div class="footer-tools">
                <button onclick="copyToClipboard('${item.id}')" class="copy-btn">Копіювати</button>
            </div>
        `;
        return el;
    }

    // Пошук та фільтрація
    handleSearch(query, category) {
        this.filteredData = this.data.filter(item => {
            const matchesCategory = category === 'all' || item.category === category;
            const matchesText = item.title.toLowerCase().includes(query) || 
                                item.content.toLowerCase().includes(query);
            return matchesCategory && matchesText;
        });
        this.renderContent(query);
    }

    // Теми та Стан
    toggleTheme() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    loadTheme() {
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
    }

    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value.toLowerCase(), document.getElementById('categoryFilter').value);
        });

        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        window.addEventListener('scroll', () => {
            // Кнопка вгору
            const btn = document.getElementById('backToTop');
            btn.classList.toggle('hidden', window.scrollY < 500);
            
            // Збереження прогресу
            localStorage.setItem('lastScroll', window.scrollY);
        });
    }
}

new App();
