function getInputValues() {
  return {
    clientPrice: Number(document.getElementById("clientPrice").value),
    salesMin: Number(document.getElementById("salesMin").value),
    salesMax: Number(document.getElementById("salesMax").value),
    commissionRatio:
      Number(document.getElementById("commissionRatio").value) / 100,
    commission: Number(document.getElementById("commission").value),
    isFixedCommission: document.getElementById("isFixedCommission").checked,
    ipFeePercentage:
      Number(document.getElementById("ipFeePercentage").value) / 100,
    developerHours: Number(document.getElementById("developerHours").value),
    developerHourlyCost: Number(
      document.getElementById("developerHourlyCost").value
    ),
    overhead: Number(document.getElementById("overhead").value) * 12,
    taxRate: Number(document.getElementById("taxRate").value) / 100,
  };
}

function calculateMetrics(inputValues, sales) {
  // Extract values from inputValues for clarity
  const {
    clientPrice,
    commissionRatio,
    commission,
    isFixedCommission,
    ipFeePercentage,
    developerHours,
    developerHourlyCost,
    overhead,
    taxRate,
  } = inputValues;

  // Annual developer cost
  const developerTotalCost = developerHours * developerHourlyCost * 12;

  // Sales With Commission calculations
  const salesWithCommission = sales * commissionRatio;
  const commissionRevenue = salesWithCommission * clientPrice;

  // Commission calculations
  let totalCommission;
  if (isFixedCommission) {
    totalCommission = salesWithCommission * commission;
  } else {
    totalCommission = commissionRevenue * (commission / 100);
  }

  const totalRevenue =
    (sales - salesWithCommission) * clientPrice + commissionRevenue;
  const ipFee = totalRevenue * ipFeePercentage;
  const profitBeforeTax =
    totalRevenue - (ipFee + developerTotalCost + overhead + totalCommission);
  const taxes = profitBeforeTax <= 0 ? 0 : profitBeforeTax * taxRate;
  const netProfit = profitBeforeTax - taxes;

  return {
    sales,
    totalRevenue,
    totalCommission,
    profitBeforeTax,
    netProfit,
  };
}

function executeCalculateMetricsForAllSales(inputValues) {
  // 1. Get the input values
  const { salesMin, salesMax } = inputValues;

  // 2. Create an empty array to store the results
  const results = [];

  // 3. Loop from salesMin to salesMax
  for (let sales = salesMin; sales <= salesMax; sales++) {
    const metrics = calculateMetrics(inputValues, sales);
    // 4. Push each result into the results array
    results.push(metrics);
  }

  return results;
}

function displayResults(metricsArray) {
  const sales = metricsArray.map((metrics) => metrics.sales);
  const totalRevenues = metricsArray.map((metrics) => metrics.totalRevenue);
  const totalCommission = metricsArray.map(
    (metrics) => metrics.totalCommission
  );
  const profitsBeforeTax = metricsArray.map(
    (metrics) => metrics.profitBeforeTax
  );
  const netProfits = metricsArray.map((metrics) => metrics.netProfit);

  // Create chart with these arrays
  createFixedChart(sales, totalRevenues, totalCommission, netProfits);
}

function createFixedChart(sales, totalRevenues, totalCommission, netProfit) {
  const ctx = document.getElementById("earningsChart").getContext("2d");

  // Check and destroy any existing chart instance
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  // Create a new chart instance with multiple datasets
  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: sales, // The x-axis will show the number of clients
      datasets: [
        {
          label: "Revenue",
          data: totalRevenues,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "Commission",
          data: totalCommission,

          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",

          borderWidth: 1,
          fill: false,
        },
        {
          label: "Net Profit",
          data: netProfit,
          backgroundColor: "rgb(60, 179, 113, 0.2)",
          borderColor: "rgb(60, 179, 113, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Total Sales",
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true, // changed to true to show legends as we have multiple datasets
        },
      },
    },
  });
}

function calculateAndDisplay() {
  const inputValues = getInputValues();
  const results = executeCalculateMetricsForAllSales(inputValues);
  displayResults(results);
}

document
  .getElementById("calculateButton")
  .addEventListener("click", calculateAndDisplay);
