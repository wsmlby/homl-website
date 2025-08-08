document.addEventListener('DOMContentLoaded', () => {
    const modelSearchInput = document.getElementById('model-search');
    const modelList = document.getElementById('model-list');
    const modelCards = modelList ? Array.from(modelList.getElementsByClassName('model-card')) : [];

    const filterModels = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        modelCards.forEach(card => {
            const modelName = card.dataset.modelName.toLowerCase();
            if (modelName.includes(lowerCaseQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    if (modelSearchInput) {
        modelSearchInput.addEventListener('input', (e) => {
            filterModels(e.target.value);
        });

        // Check for search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            modelSearchInput.value = query;
            filterModels(query);
        }
    }
});