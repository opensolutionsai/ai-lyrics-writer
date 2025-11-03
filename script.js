document.addEventListener('DOMContentLoaded', () => {
    // Get all the elements we need
    const songForm = document.getElementById('song-form');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const resultsDiv = document.getElementById('results');
    const originalOutput = document.getElementById('original-song-output');
    const correctedOutput = document.getElementById('corrected-song-output');

    // Handle the form submission
    songForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the form from reloading the page
        
        // --- IMPORTANT ---
        // 1. Activate your n8n workflow.
        // 2. Click the 'Webhook' node and copy the 'Production' URL.
        // 3. Paste the URL here:
        const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_PRODUCTION_URL_HERE';
        
        if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_PRODUCTION_URL_HERE') {
            alert('Error: Please update the N8N_WEBHOOK_URL in script.js');
            return;
        }

        // Show loader, hide old results
        loader.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        generateBtn.disabled = true;

        // Get data from the form
        const formData = new FormData(songForm);
        const data = {
            "Song Language": formData.get('song-language'),
            "your song prompt": formData.get('song-prompt'),
            "example song lyrics": formData.get('example-lyrics')
        };

        try {
            // Send the data to the n8n webhook
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Get the JSON response from n8n
            const result = await response.json();

            // Display the results
            originalOutput.textContent = result.originalSong;
            correctedOutput.textContent = result.correctedSong;
            resultsDiv.classList.remove('hidden');

        } catch (error) {
            console.error('Error fetching from n8n:', error);
            originalOutput.textContent = 'An error occurred. Please check the console.';
            resultsDiv.classList.remove('hidden');
        } finally {
            // Hide loader
            loader.classList.add('hidden');
            generateBtn.disabled = false;
        }
    });
});
