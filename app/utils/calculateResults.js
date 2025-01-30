export const calculateResults = (selectedCalculator, inputs) => {
  let result = 0;

  switch (selectedCalculator.id) {
    case '1': { // 🚗 Transport Impact (kg CO₂)
      const { transportDistance, vehicleType } = inputs;
      const vehicleEmissions = { 
        car: 0.25,  // kg CO₂ per km
        bus: 0.1, 
        bike: 0.05, 
        train: 0.08, 
        motorcycle: 0.2 
      };
      result = (parseFloat(transportDistance) || 0) * (vehicleEmissions[vehicleType] || 0);
      break;
    }
    case '2': { // 🚿 Weekly Water Usage (Liters)
      const { weeklyShowers, dailyCooking, weeklyLaundry } = inputs;
      result = (parseFloat(weeklyShowers) || 0) * 50 +  // 50L per shower
               (parseFloat(dailyCooking) || 0) * 5 * 7 +  // 15L per cooking session, converted to weekly
               (parseFloat(weeklyLaundry) || 0) * 50;  // 80L per laundry load
      break;
    }
    case '3': { // 🍽️ Calorie & Nutrition Impact (kg CO₂)
      const { meat, vegetables, grains } = inputs;
      const calorieCO2Impact = { 
        meat: 27,        // kg CO₂ per portion
        vegetables: 3,  
        grains: 5
      };
      result = ((parseFloat(meat) || 0) * calorieCO2Impact.meat) +
               ((parseFloat(vegetables) || 0) * calorieCO2Impact.vegetables) +
               ((parseFloat(grains) || 0) * calorieCO2Impact.grains);
      break;
    }
    case '4': { // ⚡ Renewable Energy Savings
      const { energyUsage, kwhPrice, solarPanelCost } = inputs;
      const co2PerKwh = 0.5; // Avg CO₂ emissions per kWh
      const monthlyCost = (parseFloat(energyUsage) || 0) * (parseFloat(kwhPrice) || 0);
      const co2Saved = (parseFloat(energyUsage) || 0) * co2PerKwh;
      const paybackPeriod = solarPanelCost ? (parseFloat(solarPanelCost) / monthlyCost) : 0;
      result = { monthlyCost, co2Saved, paybackPeriod };
      break;
    }
    case '5': { // 💪 Protein Source Impact (kg CO₂)
      const { proteinIntake, proteinSource } = inputs;
      const proteinCO2Impact = {
        beef: 27, 
        chicken: 6.9, 
        fish: 5, 
        eggs: 4.5, 
        dairy: 3.2, 
        plant: 1.5 
      };
      result = ((parseFloat(proteinIntake) || 0) / 1000) * (proteinCO2Impact[proteinSource] || 0); // Convert g to kg
      break;
    }
    case '6': { // ♻️ Recycling Impact (kg Waste Recycled)
      const { smallBags, mediumBags, largeBags } = inputs;
      result = ((parseFloat(smallBags) || 0) * 0.5) +  // 0.5 kg per small bag
               ((parseFloat(mediumBags) || 0) * 2) +  // 2 kg per medium bag
               ((parseFloat(largeBags) || 0) * 5);  // 5 kg per large bag
      break;
    }
    default:
      break;
  }

  return typeof result === 'object' ? result : parseFloat(result.toFixed(2));
};

  