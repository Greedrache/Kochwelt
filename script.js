function scaleIngredients() {
    const portionsInput = document.getElementById('portions');
    const portions = Math.abs(parseInt(portionsInput.value) || 1); // Convert to positive, default to 1 if empty
    const factor = portions; // Skalierungsfaktor
    
    const ingredients = document.querySelectorAll('.ingredient');
    
    ingredients.forEach(ingredientCell => {
        let originalText = ingredientCell.dataset.original; // Originalwert holen
        let scaledText = scaleIngredient(originalText, factor);
        ingredientCell.textContent = scaledText;
    });
}

// Hilfsfunktion: Parst und skaliert eine Zutat
function scaleIngredient(text, factor) {
    // Regex: Zahl (mit Dezimal oder Bruch), Einheit (optional), Rest
    const match = text.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-ZäöüÄÖÜß]+)?\s*(.*)$/i);
    
    if (!match) {
        return text; // Kein Match, unverändert zurückgeben
    }
    
    let quantityStr = match[1]; // z.B. "500", "1.5", "1/2"
    let unit = match[2] ? match[2].toLowerCase() : ''; // z.B. "g", "löffel"
    let name = match[3].trim(); // z.B. "Kartoffeln"
    
    // Parse Quantity zu Float
    let quantity = parseFloat(quantityStr.replace('/', '')); // Vereinfacht
    if (quantityStr.includes('/')) {
        const parts = quantityStr.split('/');
        quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
        quantity = parseFloat(quantityStr);
    }
    
    // Skaliere Quantity
    let scaledQuantity = quantity * factor;
    
    // Runde auf 2 Dezimalen, falls nötig
    if (Number.isInteger(scaledQuantity)) {
        scaledQuantity = Math.round(scaledQuantity);
    } else {
        scaledQuantity = scaledQuantity.toFixed(2);
    }
    
    // Einheiten-Umrechnung
    let scaledUnit = unit;
    if (unit === 'g' && scaledQuantity >= 1000) {
        scaledQuantity /= 1000;
        scaledUnit = 'kg';
        if (!Number.isInteger(scaledQuantity)) {
            scaledQuantity = scaledQuantity.toFixed(2);
        }
    } else if (unit === 'ml' && scaledQuantity >= 1000) {
        scaledQuantity /= 1000;
        scaledUnit = 'l';
        if (!Number.isInteger(scaledQuantity)) {
            scaledQuantity = scaledQuantity.toFixed(2);
        }
    }
    
    // Baue neuen String
    let newText = `${scaledQuantity}${scaledUnit ? scaledUnit : ''} ${name}`;
    if (!scaledUnit && !name.includes(scaledQuantity)) {
        newText = `${scaledQuantity} ${name}`;
    }
    
    return newText.trim();
}

function sendMail(event) {
    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#answer").value.trim();

    // Zusätzliche Validierung für bessere Benutzerfreundlichkeit
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