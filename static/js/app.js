document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Model search filtering
    const modelSearch = document.getElementById('model-search');
    
    const filterModels = (searchTerm) => {
        const models = document.querySelectorAll('.model-card');
        models.forEach(model => {
            const modelName = model.querySelector('h3').textContent.toLowerCase();
            const modelDescription = model.querySelector('p').textContent.toLowerCase();
            if (modelName.includes(searchTerm) || modelDescription.includes(searchTerm)) {
                model.style.display = '';
            } else {
                model.style.display = 'none';
            }
        });
    };

    if (modelSearch) {
        // Handle live search input
        modelSearch.addEventListener('input', (e) => {
            filterModels(e.target.value.toLowerCase());
        });

        // Check for search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        if (searchQuery) {
            modelSearch.value = searchQuery;
            filterModels(searchQuery.toLowerCase());
        }
    }

    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('.prose pre');
    codeBlocks.forEach(codeBlock => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        codeBlock.appendChild(button);

        button.addEventListener('click', () => {
            const code = codeBlock.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.textContent = 'Error';
            });
        });
    });
});
