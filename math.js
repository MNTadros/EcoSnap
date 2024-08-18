import fs from 'fs';

function calculateBMR(age, sex, weight, height) {
    if (sex === "male") {
        return 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else if (sex === "female") {
        return 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }
    throw new Error("Invalid sex specified");
}

function calculateDailyCalories(bmr, activityLevel = "moderate") {
    const activityMultiplier = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };
    return bmr * (activityMultiplier[activityLevel] || 1.55);
}

function calculateMetrics(item, averageCalories, averageCF, bmr, dailyCalories) {
    const calories = parseFloat(item.calories);
    const sugar = parseFloat(item.sugar);
    const protein = parseFloat(item.protein);
    const fat = parseFloat(item.fat);
    const numSustainableAlternatives = item.sustainable_alternatives.length;

    const basicCF = calories * (averageCF / averageCalories);
    const macronutrientCF = (protein * 0.02) + (fat * 0.03) + (sugar * 0.01);
    const adjustedCF = basicCF * (1 - (numSustainableAlternatives / 5));
    const carbonFootprint = adjustedCF + macronutrientCF;

    const maxCF = 10; 
    const maxCalories = 2000; 

    const normalizedCF = carbonFootprint / maxCF;
    const ecoScore = Math.max(0, 5 * (1 - normalizedCF));

    return {
        carbonFootprint: carbonFootprint.toFixed(2),
        ecoScore: ecoScore.toFixed(2)
    };
}

// Sample user input and data
const age = 30; // Sample age
const sex = "female"; // Sample sex
const weight = 70; // Sample weight in kg
const height = 170; // Sample height in cm
const averageCalories = 2200; // Average daily caloric intake
const averageCF = 5; // Average daily carbon footprint in kg CO2e

const bmr = calculateBMR(age, sex, weight, height);
const dailyCalories = calculateDailyCalories(bmr, "moderate");

fs.readFile('entries.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const entries = JSON.parse(data);
    entries.forEach(item => {
        const metrics = calculateMetrics(item.content, averageCalories, averageCF, bmr, dailyCalories);
        console.log(`Item: ${item.content.item_name}`);
        console.log(`Carbon Footprint: ${metrics.carbonFootprint} kg CO2e`);
        console.log(`EcoScore: ${metrics.ecoScore}/5`);
        console.log('--------------------');
    });
});
