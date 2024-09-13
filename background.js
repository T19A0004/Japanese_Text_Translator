chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'translate') {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&dt=rm&dt=at&q=${encodeURIComponent(request.text)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0] && data[0][0] && data[0][0][0] && data[0][1] && data[0][1][3]) {
                    const translatedText = data[0][0][0];
                    const romaji = data[0][1][3];
                    sendResponse({ type: 'translated', text: translatedText, romaji: romaji });
                } else {
                    sendResponse({ type: 'error', message: 'Unexpected response format.' });
                }
            })
            .catch(error => {
                console.error('Error during translation API call:', error);
                sendResponse({ type: 'error', message: 'Translation failed due to an error.' });
            });
        return true; // Indicates async response
    }
});
