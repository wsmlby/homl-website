document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('model-search');
    if (searchInput) {
        const modelCards = document.querySelectorAll('.model-card');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            modelCards.forEach(card => {
                const modelName = card.dataset.modelName.toLowerCase();
                if (modelName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
