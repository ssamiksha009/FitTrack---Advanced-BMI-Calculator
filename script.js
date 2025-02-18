document.addEventListener("DOMContentLoaded", loadHistory);

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const unitSelect = document.getElementById("unit");

calculateBtn.addEventListener("click", calculateBMI);
resetBtn.addEventListener("click", resetForm);
shareBtn.addEventListener("click", shareResult);
darkModeToggle.addEventListener("change", toggleDarkMode);

function calculateBMI() {
    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);
    let unit = unitSelect.value;

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert("Please enter valid values.");
        return;
    }

    if (unit === "imperial") {
        weight = weight * 0.453592;
        height = height * 2.54;
    }

    let bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let category = getBMICategory(bmi);
    let idealWeight = ((18.5 * ((height / 100) ** 2)).toFixed(1)) + "kg - " +
                      ((24.9 * ((height / 100) ** 2)).toFixed(1)) + "kg";
    
    document.getElementById("bmiValue").innerText = bmi;
    document.getElementById("category").innerText = `Category: ${category}`;
    document.getElementById("idealWeight").innerText = `Ideal Weight Range: ${idealWeight}`;
    document.getElementById("recommendation").innerText = getRecommendations(category);
    document.getElementById("result").classList.remove("hidden");

    updateProgressBar(bmi);
    saveHistory(bmi, category);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Normal";
    if (bmi < 29.9) return "Overweight";
    return "Obese";
}

function getRecommendations(category) {
    const tips = {
        "Underweight": "Consider eating more calories and strength training.",
        "Normal": "Maintain your current lifestyle!",
        "Overweight": "Try a balanced diet and regular exercise.",
        "Obese": "Consult a nutritionist and consider lifestyle changes."
    };
    return tips[category];
}

function updateProgressBar(bmi) {
    let percentage = (bmi / 40) * 100;
    document.getElementById("progress").style.width = `${percentage}%`;
}

function saveHistory(bmi, category) {
    let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    history.push(`${bmi} - ${category}`);
    localStorage.setItem("bmiHistory", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    document.getElementById("historyList").innerHTML = history.map(h => `<li>${h}</li>`).join("");
}

function resetForm() {
    document.getElementById("weight").value = "";
    document.getElementById("height").value = "";
    document.getElementById("result").classList.add("hidden");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function shareResult() {
    navigator.clipboard.writeText(`My BMI is ${document.getElementById("bmiValue").innerText}`);
    alert("Result copied!");
}
