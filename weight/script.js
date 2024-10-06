//Gravitational acceleration on each planet (in m/s^2)
const gravitationalAccelerations = {
    earth: 9.81,
    kepler186f: 0.45,
    K2_18b: 1.25,
    LHS3844b: 1.18,
    GJ357d: 1.5,
    TRAPPIST: 1.2,
    HD209458b: 8.6,
    WASP_12b: 13.6,
    _55Cancric: 10.5,
    GJ1132b:1.4,
    K2_72e:1.6,
    TRAPPIST_1D:0.62
};
  //Function to calculate weight on each planet
function calculateWeightOnPlanets(weightOnEarth) {
    const weightsOnPlanets = {};
    for (const planet in gravitationalAccelerations) {
      const gravityOnPlanet = gravitationalAccelerations[planet];
      const weightOnPlanet =
        (weightOnEarth * gravityOnPlanet) / gravitationalAccelerations.earth;
      weightsOnPlanets[planet] = weightOnPlanet;
    }
    return weightsOnPlanets;
}
  //Function to handle button click and display results
function calculateWeights() {
    const earthWeightInput = document.getElementById("earthWeight");
    const resultDiv = document.getElementById("result");
    const weightOnEarth = parseFloat(earthWeightInput.value);
    if (!isNaN(weightOnEarth)) {
      const weightsOnPlanets = calculateWeightOnPlanets(weightOnEarth);
      let resultText = ``;
      for (const planet in weightsOnPlanets) {
        resultText += `<div class="planet-box">
          <p>${
            planet.charAt(0).toUpperCase() + planet.slice(1)
          }<br>${weightsOnPlanets[planet].toFixed(2)}kg</p>
          </div>`;
       }
      resultDiv.innerHTML = resultText;
    } else {
      resultDiv.innerHTML = "<p>Please enter a valid weight.</p>";
    }
}