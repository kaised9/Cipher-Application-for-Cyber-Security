document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const key = document.getElementById('key');
    const cipher = document.getElementById('cipher');
    const encryptBtn = document.getElementById('encrypt');
    const decryptBtn = document.getElementById('decrypt');
    const copyBtn = document.getElementById('copy');

    if (!input || !output || !key || !cipher || !encryptBtn || !decryptBtn) {
        console.error('One or more required elements are missing from the DOM');
        return;
    }

    function caesarCipher(text, shift, encrypt = true) {
        return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                let shiftedCode = code + (encrypt ? shift : -shift);
                if (code >= 65 && code <= 90) {
                    return String.fromCharCode((shiftedCode - 65 + 26) % 26 + 65);
                }
                if (code >= 97 && code <= 122) {
                    return String.fromCharCode((shiftedCode - 97 + 26) % 26 + 97);
                }
            }
            return char;
        }).join('');
    }

    function vigenereEncrypt(text, key) {
        let result = '';
        key = key.toUpperCase();
        let keyIndex = 0;
    
        for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (isLetter(char)) {
            const isUpper = char === char.toUpperCase();
            const charCode = char.toUpperCase().charCodeAt(0) - 65;
            const shift = key[keyIndex % key.length].charCodeAt(0) - 65;
            const encryptedCharCode = ((charCode + shift) % 26) + 65;
            result += isUpper
            ? String.fromCharCode(encryptedCharCode)
            : String.fromCharCode(encryptedCharCode).toLowerCase();
            keyIndex++;
        } else {
            result += char; // Non-alphabetic characters remain unchanged
        }
        }
    
        return result;
    }
    

    function vigenereDecrypt(text, key) {
        let result = '';
        key = key.toUpperCase();
        let keyIndex = 0;
    
        for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (isLetter(char)) {
            const isUpper = char === char.toUpperCase();
            const charCode = char.toUpperCase().charCodeAt(0) - 65;
            const shift = key[keyIndex % key.length].charCodeAt(0) - 65;
            const decryptedCharCode = ((charCode - shift + 26) % 26) + 65;
            result += isUpper
            ? String.fromCharCode(decryptedCharCode)
            : String.fromCharCode(decryptedCharCode).toLowerCase();
            keyIndex++;
        } else {
            result += char; // Non-alphabetic characters remain unchanged
        }
        }
    
        return result;
    }
    
    function isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    function rot13(text) {
        return caesarCipher(text, 13);
    }

    const baconAlphabet = {
        
        'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
        'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAB',
        'K': 'ABABA', 'L': 'ABABB', 'M': 'ABBAA', 'N': 'ABBAB', 'O': 'ABBBA',
        'P': 'ABBBB', 'Q': 'BAAAA', 'R': 'BAAAB', 'S': 'BAABA', 'T': 'BAABB',
        'U': 'BABAA', 'V': 'BABAB', 'W': 'BABBA', 'X': 'BABBB', 'Y': 'BBAAA',
        'Z': 'BBAAB'
    };

    function baconEncrypt(text) {
        return text.toUpperCase().split('').map(char => {
            if (char.match(/[A-Z]/)) {
                return baconAlphabet[char];
            }
            return char;
        }).join(' ');
    }

    function baconDecrypt(text) {
        const reverseBacon = Object.fromEntries(
            Object.entries(baconAlphabet).map(([key, value]) => [value, key])
        );
        return text.split(' ').map(code => {
            if (code.match(/[AB]{5}/)) {
                return reverseBacon[code] || code;
            }
            return code;
        }).join('');
    }

    function checkIfTextIsAlphabetic(text) {
        return text.match(/^[a-z]+$/i);
    }

    encryptBtn.addEventListener('click', () => {
        const text = input.value;
        const selectedCipher = cipher.value;
        let result;

        switch (selectedCipher) {
            case 'caesar':
                const key = parseInt(document.getElementById('key').value, 10) || 0;
                console.log(key)
                result = caesarCipher(text, key);
                break;
            case 'vigenere':
                if (!checkIfTextIsAlphabetic(key.value)) {
                    alert('Key must be alphabetic!');
                    return;
                }
                result = vigenereEncrypt(text, key.value);
                break;
            case 'rot13':
                result = rot13(text);
                break;
            case 'bacon':
                result = baconEncrypt(text);
                break;
        }

        output.value = result;
    });

    decryptBtn.addEventListener('click', () => {
        const text = input.value;
        const selectedCipher = cipher.value;
        let result;

        switch (selectedCipher) {
            case 'caesar':
                const key = parseInt(document.getElementById('key').value, 10) || 0;
                console.log(key)
                result = caesarCipher(text, key, false);
                break;
            case 'vigenere':
                if (!checkIfTextIsAlphabetic(key.value)) {
                    alert('Key must be alphabetic!');
                    return;
                }
                result = vigenereDecrypt(text, key.value);
                break;
            case 'rot13':
                result = rot13(text);
                break;
            case 'bacon':
                result = baconDecrypt(text);
                break;
        }

        output.value = result;
    });

    copyBtn.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
});

