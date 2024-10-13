document.getElementById('generate-password').addEventListener('click', generatePassword);
document.getElementById('copy-password').addEventListener('click', copyPassword);
document.getElementById('clear-password').addEventListener('click', clearPassword);
document.getElementById('clear-history').addEventListener('click', clearHistory);
document.getElementById('toggle-theme').addEventListener('click', toggleTheme);
document.getElementById('start-auto-generate').addEventListener('click', startAutoGenerate);
document.getElementById('stop-auto-generate').addEventListener('click', stopAutoGenerate);
document.getElementById('submit-feedback').addEventListener('click', submitFeedback);
document.getElementById('template1').addEventListener('click', () => applyTemplate(1));
document.getElementById('template2').addEventListener('click', () => applyTemplate(2));
document.getElementById('template3').addEventListener('click', () => applyTemplate(3));
document.getElementById('export-txt').addEventListener('click', () => exportPasswords('txt'));
document.getElementById('export-csv').addEventListener('click', () => exportPasswords('csv'));

let autoGenerateInterval;

function generatePassword() {
    const length = document.getElementById('password-length').value;
    const includeLower = document.getElementById('include-lowercase').checked;
    const includeUpper = document.getElementById('include-uppercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
    const customCharacters = document.getElementById('custom-characters').value;

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = '';
    if (includeLower) characters += lowerCase;
    if (includeUpper) characters += upperCase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;
    if (customCharacters) characters += customCharacters;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    document.getElementById('password-output').value = password;
    updateStrengthBar(password);
    addPasswordToHistory(password);
}

function copyPassword() {
    const password = document.getElementById('password-output').value;
    navigator.clipboard.writeText(password).then(() => {
        alert('Şifre kopyalandı!');
    });
}

function clearPassword() {
    document.getElementById('password-output').value = '';
}

function clearHistory() {
    const historyList = document.getElementById('password-history');
    historyList.innerHTML = '';
}

function updateStrengthBar(password) {
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const strength = calculateStrength(password);

    let color;
    let text;
    if (strength < 3) {
        color = 'red';
        text = 'Zayıf';
    } else if (strength < 5) {
        color = 'yellow';
        text = 'Orta';
    } else {
        color = 'green';
        text = 'Güçlü';
    }

    strengthBar.style.backgroundColor = color;
    strengthBar.style.width = (strength / 6) * 100 + '%';
    strengthText.textContent = `Şifre Gücü: ${text}`;
}

function calculateStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (password.length >= 12) strength++;

    return strength;
}

function addPasswordToHistory(password) {
    const historyList = document.getElementById('password-history');
    const listItem = document.createElement('li');
    listItem.textContent = password;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Sil';
    deleteButton.addEventListener('click', () => {
        historyList.removeChild(listItem);
    });

    listItem.appendChild(deleteButton);
    historyList.appendChild(listItem);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function startAutoGenerate() {
    stopAutoGenerate(); // Önceki interval'ı durdur.
    autoGenerateInterval = setInterval(generatePassword, 5000); // Her 5 saniyede bir şifre üret.
}

function stopAutoGenerate() {
    clearInterval(autoGenerateInterval);
}

function submitFeedback() {
    const feedbackInput = document.getElementById('feedback-input');
    alert(`Geri bildiriminiz için teşekkürler: ${feedbackInput.value}`);
    feedbackInput.value = ''; // Geri bildirim alanını temizle.
}

function applyTemplate(template) {
    switch(template) {
        case 1: // Kolay Şifre
            document.getElementById('password-length').value = 8;
            document.getElementById('include-lowercase').checked = true;
            document.getElementById('include-uppercase').checked = false;
            document.getElementById('include-numbers').checked = false;
            document.getElementById('include-symbols').checked = false;
            break;
        case 2: // Orta Zorlukta Şifre
            document.getElementById('password-length').value = 12;
            document.getElementById('include-lowercase').checked = true;
            document.getElementById('include-uppercase').checked = true;
            document.getElementById('include-numbers').checked = true;
            document.getElementById('include-symbols').checked = false;
            break;
        case 3: // Zor Şifre
            document.getElementById('password-length').value = 16;
            document.getElementById('include-lowercase').checked = true;
            document.getElementById('include-uppercase').checked = true;
            document.getElementById('include-numbers').checked = true;
            document.getElementById('include-symbols').checked = true;
            break;
    }
    generatePassword();
}

function exportPasswords(format) {
    const historyList = document.getElementById('password-history');
    let content = '';

    if (format === 'txt') {
        for (const item of historyList.children) {
            content += `${item.textContent.replace('Sil', '').trim()}\n`;
        }
    } else if (format === 'csv') {
        content = 'Şifre\n';
        for (const item of historyList.children) {
            content += `${item.textContent.replace('Sil', '').trim()}\n`;
        }
    }

    const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `passwords.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
