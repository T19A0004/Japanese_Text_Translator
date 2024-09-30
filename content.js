function createPopup(translatedText, romaji) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    // Structure the content for better readability
    const translationElement = document.createElement('div');
    translationElement.classList.add('translation');
    translationElement.textContent = `Translation: ${translatedText}`;
    
    const romajiElement = document.createElement('div');
    romajiElement.classList.add('romaji');
    romajiElement.textContent = `Romaji: ${romaji}`;
    
    popup.appendChild(translationElement);
    popup.appendChild(romajiElement);

    // Add enhanced styling
    popup.style.position = 'absolute';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.fontSize = '14px';
    popup.style.maxWidth = '250px';
    popup.style.wordWrap = 'break-word';
    popup.style.lineHeight = '1.5';
    popup.style.zIndex = 9999; // Ensure it appears on top

    return popup;
}

function removeExistingPopup() {
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) {
        existingPopup.remove();
    }
}

document.addEventListener('mouseup', (event) => {
    removeExistingPopup();  // Remove any existing popup

    const selectedText = window.getSelection().toString();
    if (selectedText) {
        chrome.runtime.sendMessage({ type: 'translate', text: selectedText }, (response) => {
            if (response.type === 'translated') {
                const popup = createPopup(response.text, response.romaji);
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    
                    popup.style.left = `${rect.left}px`;
                    popup.style.top = `${rect.bottom + window.scrollY + 10}px`; // Add a small offset

                    document.body.appendChild(popup);
                }
            } else {
                console.error('Translation failed:', response.message);
            }
        });
    }
});

document.addEventListener('click', removeExistingPopup); // Remove popup on click elsewhere
