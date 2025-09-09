function scaleIngredients() {
        const portionsInput = document.getElementById('portions');
        const portions = parseInt(portionsInput.value) || 1; // Standard 1, falls leer
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


    function sendMail(event){﻿
    event.preventDefault();
    const data = new FormData(event.target);

    fetch("https://formspree.io/f/xeolvqvv", {
        method: "POST",
        body: new FormData(event.target),
        headers: {
            'Accept': 'application/json'
        }
    }).then(() => {
        window.location.href = "./send_mail.html";
    }).catch((error) => {
        console.log(error);
    });
}