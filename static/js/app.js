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

    // Dynamically add copy buttons to code blocks generated from markdown
    const codeBlocks = document.querySelectorAll('.prose pre');
    codeBlocks.forEach(pre => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const button = document.createElement('button');
        button.className = 'copy-btn absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span class="copy-tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 pointer-events-none transition-opacity duration-300">Copied!</span>
        `;
        wrapper.appendChild(button);
    });

    // Attach event listeners to all copy buttons (including static and dynamic ones)
    const attachCopyListeners = () => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
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
                    console.error('Clipboard API not available.');
                    alert('Copying to clipboard is not supported in this browser.');
                }
            });
        });
    };

    attachCopyListeners();
});
