function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function validatePortions() {
    const portionsInput = document.getElementById('portions');
    let portions = parseInt(portionsInput.value) || 1;
    
    if (portions < 1 || isNaN(portions)) {
        showError('Portionen können nicht negativ sein. Mindestens 1 Portion.');
        portionsInput.value = 1;
        return false;
    } else if (portions > 5) {
        showError('Maximale Portionen: 5. Bitte wähle weniger.');
        portionsInput.value = 5;
        return false;
    }
    
    document.getElementById('error-message').style.display = 'none';
    return true;
}

function scaleIngredients() {
    if (!validatePortions()) {
        return;
    }
    
    const portionsInput = document.getElementById('portions');
    const portions = parseInt(portionsInput.value) || 1;
    const factor = portions;
    
    const ingredients = document.querySelectorAll('.ingredient');
    
    ingredients.forEach(ingredientCell => {
        let originalText = ingredientCell.dataset.original;
        let scaledText = scaleIngredient(originalText, factor);
        ingredientCell.textContent = scaledText;
    });
}

function scaleIngredient(text, factor) {
    const match = text.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-ZäöüÄÖÜßEL]+)?\s*(.*)$/i);
    
    if (!match) {
        return text;
    }
    
    let quantityStr = match[1];
    let unit = match[2] ? match[2].toLowerCase() : '';
    let name = match[3].trim();
    
    let quantity;
    if (quantityStr.includes('/')) {
        const parts = quantityStr.split('/');
        quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
        quantity = parseFloat(quantityStr);
    }
    
    if (isNaN(quantity)) {
        return text;
    }
    
    let scaledQuantity = quantity * factor;
    
    if (Number.isInteger(scaledQuantity)) {
        scaledQuantity = Math.round(scaledQuantity);
    } else {
        scaledQuantity = parseFloat(scaledQuantity.toFixed(2));
    }
    
    let scaledUnit = unit;
    if (unit === 'g' && scaledQuantity >= 1000) {
        scaledQuantity /= 1000;
        scaledUnit = 'kg';
    } else if (unit === 'ml' && scaledQuantity >= 1000) {
        scaledQuantity /= 1000;
        scaledUnit = 'l';
    }
    
    let quantityDisplay = Number.isInteger(scaledQuantity) ? scaledQuantity.toString() : scaledQuantity.toFixed(2);
    let newText = `${quantityDisplay}${scaledUnit ? ' ' + scaledUnit.toUpperCase() : ''} ${name}`.trim();
    
    return newText;
}

function sendMail(event) {
    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#answer").value.trim();

    if (!name || name.length < 2) {
        alert("Bitte gib deinen Namen ein (mindestens 2 Zeichen).");
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Bitte gib eine gültige E-Mail-Adresse ein.");
        return;
    }
    if (!message || message.length < 10) {
        alert("Bitte gib eine Nachricht ein (mindestens 10 Zeichen).");
        return;
    }

    fetch("https://formspree.io/f/xeolvqvv", {
        method: "POST",
        body: data,
        headers: {
            Accept: "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                window.location.href = "./send_mail.html";
            } else {
                throw new Error("Fehler beim Senden des Formulars.");
            }
        })
        .catch((error) => {
            console.error("Fehler:", error);
            alert("Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es erneut.");
        });
}