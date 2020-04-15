const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;

  const impact = {};
  const severeImpact = {};

  let periodInDays;
  let factor;

  if (periodType === 'days') {
    periodInDays = timeToElapse;
    factor = Math.floor(periodInDays / 3);
  } else if (periodType === 'weeks') {
    periodInDays = timeToElapse * 7;
    factor = Math.floor(periodInDays / 3);
  } else if (periodType === 'months') {
    periodInDays = timeToElapse * 30;
    factor = Math.floor(periodInDays / 3);
  }

  const availableHospitalBeds = Math.ceil(0.35 * totalHospitalBeds);
  // Impact estimates
  impact.currentlyInfected = reportedCases * 10;
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** factor);
  impact.severeCasesByRequestedTime = Math.floor(0.15 * impact.infectionsByRequestedTime);
  impact.hospitalBedsByRequestedTime = availableHospitalBeds - impact.severeCasesByRequestedTime;
  impact.casesForICUByRequestedTime = Math.floor(0.05 * impact.infectionsByRequestedTime);
  impact.casesForVentilatorsByRequestedTime = Math.floor(0.02 * impact.infectionsByRequestedTime);
  impact.dollarsInFlight = Math.floor((impact.infectionsByRequestedTime
                            * region.avgDailyIncomePopulation
                            * region.avgDailyIncomeInUSD) / periodInDays);

  // Severe Impact estimates
  severeImpact.currentlyInfected = reportedCases * 50;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** factor);
  severeImpact.severeCasesByRequestedTime = Math.floor(0.15
                                                * severeImpact.infectionsByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = availableHospitalBeds
                                                - severeImpact.severeCasesByRequestedTime;
  severeImpact.casesForICUByRequestedTime = Math.floor(0.05
                                                * severeImpact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(0.02
                                                * severeImpact.infectionsByRequestedTime);
  severeImpact.dollarsInFlight = Math.floor((severeImpact.infectionsByRequestedTime
                            * region.avgDailyIncomePopulation
                            * region.avgDailyIncomeInUSD) / periodInDays);

  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
