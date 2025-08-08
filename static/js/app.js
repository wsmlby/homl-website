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

    // Copy to clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent page jump
            const pre = button.closest('.relative').querySelector('pre');
            const code = pre.querySelector('code');
            const textToCopy = code.innerText;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const tooltip = button.querySelector('.copy-tooltip');
                    if (tooltip) {
                        tooltip.style.opacity = 1;
                        setTimeout(() => {
                            tooltip.style.opacity = 0;
                        }, 1500);
                    }
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text. Please try again.');
                });
            } else {
                console.error('Clipboard API not available. This feature requires a secure context (HTTPS).');
                alert('Copying to clipboard is not supported in this browser or context.');
            }
        });
    });
});
