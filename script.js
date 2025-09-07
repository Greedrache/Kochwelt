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




// Funktion um Zutaten zu berechnen :)


function scaleIngredients() {
    const portionsInput = document.getElementById('portions');
    const portions = parseInt(portionsInput.value) || 1; // Standard 1, falls Input leer
    const factor = portions; // Für 1 Portion = Faktor 1, für 2 = 2 usw.
    
    const ingredients = document.querySelectorAll('.ingredient');
    
    ingredients.forEach(ingredientCell => {
        let originalText = ingredientCell.textContent.trim();
        let scaledText = scaleIngredient(originalText, factor);
        ingredientCell.textContent = scaledText;
    });
    
    // Optional: Speichere Originalwerte, falls du zurücksetzen möchtest
    // (Du könntest data-Attribute im HTML nutzen, z.B. data-original="500g Kartoffeln")
}

// Hilfsfunktion: Parst und skaliert eine Zutat
function scaleIngredient(text, factor) {
    // Einfaches Parsing: Suche nach Zahl (mit Dezimal oder Bruch), dann Einheit, Rest ist Name
    // Regex: Optional Bruch (z.B. 1/2), Dezimal (z.B. 1.5), Ganzzahl (z.B. 1), dann Einheit (g, kg, EL, etc.)
    const match = text.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*([a-zA-ZäöüÄÖÜß]+)?\s*(.*)$/i);
    
    if (!match) {
        // Wenn kein Match (z.B. "handvoll Kräuter"), gib unverändert zurück oder multipliziere gar nicht
        return text; // Oder: return `(${factor}x) ${text}` für Hinweis
    }
    
    let quantityStr = match[1]; // z.B. "500", "1.5", "1/2"
    let unit = match[2] ? match[2].toLowerCase() : ''; // z.B. "g", "löffel"
    let name = match[3].trim(); // z.B. "Kartoffeln"
    
    // Parse Quantity zu Float
    let quantity = parseFloat(quantityStr.replace('/', '')); // Vereinfacht: 1/2 -> 0.5 (besser mit eval oder dedizierter Lib)
    if (quantityStr.includes('/')) {
        // Einfache Bruch-Handhabung: z.B. "1/2" -> 0.5
        const parts = quantityStr.split('/');
        quantity = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
        quantity = parseFloat(quantityStr);
    }
    
    // Skaliere Quantity
    let scaledQuantity = quantity * factor;
    
    // Runde auf 2 Dezimalen, falls nötig (für g/ml), aber für ganze Zahlen sauber halten
    if (Number.isInteger(scaledQuantity)) {
        scaledQuantity = Math.round(scaledQuantity);
    } else {
        scaledQuantity = scaledQuantity.toFixed(2);
    }
    
    // Einheiten-Umrechnung (optional, für große Werte)
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
    // Erweitere für andere Einheiten, z.B. 'EL' zu 'EL' (bleibt gleich), oder 'Prise' zu 'Prisen' (Plural-Handhabung optional)
    
    // Baue neuen String: z.B. "1kg Kartoffeln" oder "2 Löffel Salz"
    let newText = `${scaledQuantity}${scaledUnit ? scaledUnit : ''} ${name}`;
    if (!scaledUnit && !name.includes(scaledQuantity)) { // z.B. für "1 Stück"
        newText = `${scaledQuantity} ${name}`;
    }
    
    return newText.trim();
}