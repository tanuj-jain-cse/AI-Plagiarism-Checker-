document.addEventListener('DOMContentLoaded', function() {
    // Checker Elements
    const checkBtn = document.getElementById('check-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const textInput = document.getElementById('text-input');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    
    // Result Elements
    const resultPreview = document.getElementById('result-preview');
    const resultDisplay = document.getElementById('result-display');
    const scoreText = document.getElementById('score-text');
    const progressBar = document.getElementById('progress-bar');
    const resultInterpretation = document.getElementById('result-interpretation');
    const detailedResults = document.getElementById('detailed-results');

    // AI Modal Elements
    const aiModal = document.getElementById('ai-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCopyBtn = document.getElementById('modal-copy-btn');
    const modalRegenerateBtn = document.getElementById('modal-regenerate-btn');
    const originalTextModal = document.getElementById('original-text-modal');
    const aiSuggestionText = document.getElementById('ai-suggestion-text');
    const aiLoadingSpinner = document.getElementById('ai-loading-spinner');
    const modalOverlay = document.getElementById('modal-overlay');

    let currentTextToFix = '';

    // Event Listeners
    checkBtn.addEventListener('click', handleCheck);
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            fileName.textContent = `Selected: ${fileInput.files[0].name}`;
            textInput.value = '';
        } else {
            fileName.textContent = '';
        }
    });

    // AI Modal Events
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !aiModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    modalCopyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(aiSuggestionText.textContent);
        modalCopyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
        setTimeout(function() {
            modalCopyBtn.innerHTML = '<i class="far fa-copy mr-2"></i>Copy Suggestion';
        }, 2000);
    });

    modalRegenerateBtn.addEventListener('click', function() {
        handleFixRequest(currentTextToFix);
    });

    function closeModal() {
        aiModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function openModal() {
        aiModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Main Functions
    function showLoadingState(isLoading) {
        checkBtn.disabled = isLoading;
        btnSpinner.classList.toggle('hidden', !isLoading);
        btnText.textContent = isLoading ? 'Analyzing...' : 'Check for Plagiarism';
        
        if (isLoading) {
            checkBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            checkBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    async function handleCheck() {
        resultPreview.classList.add('hidden');
        resultDisplay.classList.add('hidden');
        if (detailedResults) detailedResults.innerHTML = '';
        showLoadingState(true);

        try {
            const file = fileInput.files[0];
            let response;

            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                
                response = await fetch('/api/upload-pdf', {
                    method: 'POST',
                    body: formData
                });
            } else {
                const text = textInput.value;
                if (!text.trim()) throw new Error("Please enter text or upload a file.");
                
                response = await fetch('/api/check-text', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            displayResult(result);
            
        } catch (err) {
            displayError(err.message);
        } finally {
            showLoadingState(false);
            fileInput.value = '';
            fileName.textContent = '';
        }
    }

    function displayResult(result) {
        const score = result.score || 0;
        scoreText.textContent = `${score}%`;
        
        let barColor, textColor, interpretation;
        if (score > 75) {
            barColor = 'bg-red-500'; 
            textColor = 'text-red-600'; 
            interpretation = 'High similarity detected. Revision is strongly recommended.';
        } else if (score > 40) {
            barColor = 'bg-yellow-500'; 
            textColor = 'text-yellow-600'; 
            interpretation = 'Moderate similarity found. Review advised.';
        } else if (score > 10) {
            barColor = 'bg-green-500'; 
            textColor = 'text-green-600'; 
            interpretation = 'Low similarity. The document appears to be mostly original.';
        } else {
            barColor = 'bg-green-500'; 
            textColor = 'text-green-600'; 
            interpretation = 'Excellent! Very low similarity detected.';
        }

        progressBar.className = `h-3 rounded-full progress-bar ${barColor}`;
        scoreText.className = `text-4xl font-bold ${textColor}`;
        resultInterpretation.textContent = interpretation;

        setTimeout(function() { 
            progressBar.style.width = `${score}%`; 
        }, 100);

        // Show detailed results
        if (result.results && result.results.length > 0) {
            showDetailedResults(result);
        }

        resultPreview.classList.add('hidden');
        resultDisplay.classList.remove('hidden');
    }

    function showDetailedResults(result) {
        if (!detailedResults) return;
        
        let html = `
            <div class="mt-6 border-t pt-4">
                <h4 class="font-semibold text-lg mb-3">Detailed Analysis</h4>
                <div class="space-y-3 max-h-96 overflow-y-auto">
        `;
        
        let plagiarizedCount = 0;
        
        result.results.forEach(function(item, index) {
            if (!item.isPlagiarized) return;
            
            plagiarizedCount++;
            
            html += `
                <div class="p-3 border rounded-lg bg-red-50 border-red-200">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium text-red-700">Potential Plagiarism #${plagiarizedCount}</span>
                        <button class="fix-ai-btn bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600 transition-colors" data-text="${item.chunk.replace(/"/g, '&quot;')}">
                            <i class="fas fa-robot mr-1"></i>Fix with AI
                        </button>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">"${item.chunk}"</p>
            `;
            
            if (item.sources && item.sources.length > 0) {
                html += `<div class="mt-2">`;
                html += `<p class="text-xs font-semibold text-gray-600 mb-1">Found in:</p>`;
                item.sources.slice(0, 2).forEach(function(source) {
                    html += `
                        <div class="text-xs mb-1">
                            <a href="${source.link}" target="_blank" class="text-blue-600 hover:underline font-medium">
                                ${source.title || 'Source'}
                            </a>
                            <p class="text-gray-600 truncate">${source.snippet || 'No snippet available'}</p>
                        </div>
                    `;
                });
                html += `</div>`;
            }
            
            html += `</div>`;
        });

        if (plagiarizedCount === 0) {
            html += `
                <div class="p-4 border rounded-lg bg-green-50 border-green-200 text-center">
                    <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                    <p class="text-green-700 font-medium">No plagiarism detected in individual sentences!</p>
                </div>
            `;
        }
        
        html += `</div></div>`;
        detailedResults.innerHTML = html;

        // Add event listeners to Fix with AI buttons
        document.querySelectorAll('.fix-ai-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const textToFix = this.getAttribute('data-text');
                console.log('🔄 AI Fix button clicked for:', textToFix);
                handleFixRequest(textToFix);
            });
        });

        console.log(`✅ Displayed ${plagiarizedCount} plagiarized sentences with AI fix buttons`);
    }

    async function handleFixRequest(textToFix) {
        console.log('🚀 Starting AI fix request for:', textToFix);
        
        currentTextToFix = textToFix;
        openModal();
        originalTextModal.textContent = textToFix;
        aiSuggestionText.textContent = '';
        aiSuggestionText.classList.add('hidden');
        aiLoadingSpinner.style.display = 'flex';
        modalCopyBtn.disabled = true;
        modalRegenerateBtn.disabled = true;

        try {
            console.log('📨 Sending request to /api/fix-text...');
            
            const response = await fetch('/api/fix-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToFix })
            });

            console.log('📩 Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Server error:', errorData);
                throw new Error(errorData.error || 'Failed to get AI suggestion.');
            }

            const data = await response.json();
            console.log('✅ AI response data:', data);
            
            let fixedText = data.fixedText || data.text || 'No suggestion available.';
            
            aiSuggestionText.textContent = fixedText;
            aiSuggestionText.classList.remove('hidden');
            aiLoadingSpinner.style.display = 'none';
            modalCopyBtn.disabled = false;
            modalRegenerateBtn.disabled = false;

            console.log('🎉 AI fix displayed successfully');

        } catch (err) {
            console.error('❌ AI fix error:', err);
            aiSuggestionText.textContent = `Error: ${err.message}\n\nTry rephrasing this text manually by using synonyms and changing sentence structure.`;
            aiSuggestionText.classList.remove('hidden');
            aiLoadingSpinner.style.display = 'none';
            modalRegenerateBtn.disabled = false;
        }
    }

    function displayError(message) {
        resultPreview.innerHTML = `
            <div class="text-center text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p class="font-semibold">${message}</p>
            </div>
        `;
        resultPreview.classList.remove('hidden');
    }

    // Initialize the app
    console.log('Plagiarism Checker Pro initialized');
});