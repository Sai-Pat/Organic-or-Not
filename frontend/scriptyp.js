class YieldPredictor {
    constructor(cropType) {
        this.cropType = cropType.toLowerCase();
        this.cropData = {
            'wheat': { 
                minYield: 1.0, maxYield: 2.0, avgYield: 1.5,
                optimalRainfall: 500, optimalTemp: 18,
                rainfallTolerance: 200, tempTolerance: 8
            },
            'rice': { 
                minYield: 2.0, maxYield: 4.0, avgYield: 3.0,
                optimalRainfall: 1500, optimalTemp: 25,
                rainfallTolerance: 500, tempTolerance: 5
            },
            'apple': { 
                minYield: 10.0, maxYield: 20.0, avgYield: 15.0,
                optimalRainfall: 1000, optimalTemp: 12,
                rainfallTolerance: 300, tempTolerance: 10
            },
            'banana': { 
                minYield: 20.0, maxYield: 40.0, avgYield: 30.0,
                optimalRainfall: 2000, optimalTemp: 27,
                rainfallTolerance: 500, tempTolerance: 5
            },
            'sugarcane': { 
                minYield: 20.0, maxYield: 35.0, avgYield: 27.5,
                optimalRainfall: 1800, optimalTemp: 30,
                rainfallTolerance: 600, tempTolerance: 5
            }
        };
        this.fertilizerMultipliers = {
            'none': 1.0,
            'compost': 1.15,
            'bone-meal': 1.075,
            'seaweed-extract': 1.10,
            'fish-meal': 1.075,
            'kelp-meal': 1.10,
            'cottonseed-meal': 1.075,
            'dolomitic-lime': 1.05,
            'fish-emulsion': 1.10,
            'manure': 1.15,
            'rock-phosphate': 1.075,
            'bat-guano': 1.15,
            'worm-castings': 1.15
        };
    }

    predictYield(size, rainfall, temperature, soilQuality, fertilizer) {
        if (!this.validateInputs(size, rainfall, temperature, soilQuality)) {
            return "Invalid input: Check size (0-24,710 acres), rainfall (0-4000 mm), temperature (0-50°C), soil quality (1-5)";
        }

        if (!this.cropData[this.cropType]) {
            return "Unsupported crop type";
        }

        if (!this.fertilizerMultipliers[fertilizer]) {
            return "Unsupported fertilizer";
        }

        const crop = this.cropData[this.cropType];
        const rainfallFactor = this.calculateRainfallFactor(rainfall, crop);
        const tempFactor = this.calculateTemperatureFactor(temperature, crop);
        const soilFactor = 0.7 + (soilQuality * 0.06); // 70-100% based on 1-5 scale
        const fertilizerFactor = this.fertilizerMultipliers[fertilizer];
        
        const yieldRange = crop.maxYield - crop.minYield;
        const baseYield = crop.avgYield + (yieldRange * (Math.random() - 0.5) * 0.2);
        const totalYield = size * baseYield * rainfallFactor * tempFactor * soilFactor * fertilizerFactor;
        
        return Number(totalYield.toFixed(2));
    }

    calculateRainfallFactor(rainfall, crop) {
        const diff = Math.abs(rainfall - crop.optimalRainfall);
        if (diff <= crop.rainfallTolerance) return 1.0;
        const excess = diff - crop.rainfallTolerance;
        return Math.max(0.5, 1.0 - (excess * 0.05));
    }

    calculateTemperatureFactor(temperature, crop) {
        const diff = Math.abs(temperature - crop.optimalTemp);
        if (diff <= crop.tempTolerance) return 1.0;
        const excess = diff - crop.tempTolerance;
        return Math.max(0.5, 1.0 - (excess * 0.03));
    }

    validateInputs(size, rainfall, temperature, soilQuality) {
        return (size > 0 && size <= 24710 && 
                rainfall >= 0 && rainfall <= 4000 &&
                temperature >= 0 && temperature <= 50 &&
                soilQuality >= 1 && soilQuality <= 5);
    }
}

const stateData = {
    "andaman-and-nicobar-islands": { rainfall: 2967, temperature: 27, soilQuality: 3 },
    "andhra-pradesh": { rainfall: 950, temperature: 27, soilQuality: 4 },
    "arunachal-pradesh": { rainfall: 2782, temperature: 18, soilQuality: 3 },
    "assam": { rainfall: 2818, temperature: 25, soilQuality: 5 },
    "bihar": { rainfall: 1256, temperature: 25, soilQuality: 5 },
    "chhattisgarh": { rainfall: 1338, temperature: 26, soilQuality: 3 },
    "goa": { rainfall: 3005, temperature: 27, soilQuality: 2 },
    "gujarat": { rainfall: 842.5, temperature: 27, soilQuality: 4 },
    "haryana": { rainfall: 617, temperature: 24, soilQuality: 5 },
    "himachal-pradesh": { rainfall: 1251, temperature: 18, soilQuality: 3 },
    "jharkhand": { rainfall: 1326, temperature: 25, soilQuality: 3 },
    "karnataka": { rainfall: 1771, temperature: 25, soilQuality: 4 },
    "kerala": { rainfall: 3055, temperature: 27, soilQuality: 2 },
    "madhya-pradesh": { rainfall: 1017, temperature: 25, soilQuality: 4 },
    "maharashtra": { rainfall: 1455.5, temperature: 26, soilQuality: 4 },
    "manipur": { rainfall: 1881, temperature: 22, soilQuality: 5 },
    "meghalaya": { rainfall: 2818, temperature: 20, soilQuality: 3 },
    "mizoram": { rainfall: 1881, temperature: 22, soilQuality: 3 },
    "nagaland": { rainfall: 1881, temperature: 20, soilQuality: 3 },
    "odisha": { rainfall: 1489, temperature: 27, soilQuality: 3 },
    "punjab": { rainfall: 649, temperature: 23, soilQuality: 5 },
    "rajasthan": { rainfall: 494, temperature: 27, soilQuality: 1 },
    "sikkim": { rainfall: 2739, temperature: 15, soilQuality: 3 },
    "tamil-nadu": { rainfall: 998, temperature: 28, soilQuality: 3 },
    "telangana": { rainfall: 961, temperature: 27, soilQuality: 4 },
    "tripura": { rainfall: 1881, temperature: 25, soilQuality: 3 },
    "uttar-pradesh": { rainfall: 1025, temperature: 25, soilQuality: 5 },
    "uttarakhand": { rainfall: 1251, temperature: 18, soilQuality: 3 },
    "west-bengal": { rainfall: 2089, temperature: 26, soilQuality: 5 }
};

function updateEnvironmentalData() {
    const state = document.getElementById('state').value;
    if (state && stateData[state]) {
        document.getElementById('rainfall').value = stateData[state].rainfall;
        document.getElementById('temperature').value = stateData[state].temperature;
        document.getElementById('soilQuality').value = stateData[state].soilQuality;
    } else {
        document.getElementById('rainfall').value = '';
        document.getElementById('temperature').value = '';
        document.getElementById('soilQuality').value = '';
    }
}

function predictYield() {
    const cropType = document.getElementById('cropType').value;
    const size = parseFloat(document.getElementById('size').value);
    const rainfall = parseFloat(document.getElementById('rainfall').value);
    const temperature = parseFloat(document.getElementById('temperature').value);
    const soilQuality = parseFloat(document.getElementById('soilQuality').value);
    const fertilizer = document.getElementById('fertilizer').value;

    const predictor = new YieldPredictor(cropType);
    const result = predictor.predictYield(size, rainfall, temperature, soilQuality, fertilizer);

    const yieldValue = document.getElementById('yieldValue');
    if (typeof result === 'string') {
        yieldValue.textContent = result;
        yieldValue.style.color = 'red';
    } else {
        yieldValue.textContent = result;
        yieldValue.style.color = 'black';
    }
}