document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('model-search');
    if (searchInput) {
        const modelCards = document.querySelectorAll('.model-card');

        const filterModels = (searchTerm) => {
            modelCards.forEach(card => {
                const modelName = card.dataset.modelName.toLowerCase();
                if (modelName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        searchInput.addEventListener('input', (e) => {
            filterModels(e.target.value.toLowerCase());
        });

        // Check for query parameter on page load
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');

        if (searchQuery) {
            searchInput.value = searchQuery;
            filterModels(searchQuery.toLowerCase());
        }
    }
});
