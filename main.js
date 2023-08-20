function getInputValues() {
  return {
    salesWithoutCommission: Number(
      document.getElementById("salesWithoutCommission").value
    ),
    salesWithCommission: Number(
      document.getElementById("salesWithCommission").value
    ),
    smallClientPrice: Number(document.getElementById("smallClientPrice").value),
    largeClientPrice: Number(document.getElementById("largeClientPrice").value),
    ipFeePercentage:
      Number(document.getElementById("ipFeePercentage").value) / 100,
    developerHours: Number(document.getElementById("developerHours").value),
    developerHourlyCost: Number(
      document.getElementById("developerHourlyCost").value
    ),
    overhead: Number(document.getElementById("overhead").value) * 12,
    taxRate: Number(document.getElementById("taxRate").value) / 100,
    salesWithoutCommissionSmallClientsPercentage:
      Number(
        document.getElementById("salesWithoutCommissionSmallClientsPercentage")
          .value
      ) / 100,
    salesWithCommissionSmallClientsPercentage:
      Number(
        document.getElementById("salesWithCommissionSmallClientsPercentage")
          .value
      ) / 100,
    commissionValue: Number(document.getElementById("commissionValue").value),
    isFixedCommission: document.getElementById("isFixedCommission").checked,
  };
}

function calculateMetrics(inputValues) {
  // Extract values from inputValues for clarity
  const {
    salesWithoutCommission,
    salesWithCommission,
    smallClientPrice,
    largeClientPrice,
    ipFeePercentage,
    developerHours,
    developerHourlyCost,
    overhead,
    taxRate,
    salesWithoutCommissionSmallClientsPercentage,
    salesWithCommissionSmallClientsPercentage,
    commissionValue,
    isFixedCommission,
  } = inputValues;

  // Annual developer cost
  const developerTotalCost = developerHours * developerHourlyCost * 12;

  // Sales Without Commission calculations
  const salesWithoutCommissionSmallClients =
    salesWithoutCommission * salesWithoutCommissionSmallClientsPercentage;
  const salesWithoutCommissionLargeClients =
    salesWithoutCommission - salesWithoutCommissionSmallClients;
  const salesWithoutCommissionSmallClientRevenue =
    salesWithoutCommissionSmallClients * smallClientPrice;
  const salesWithoutCommissionLargeClientRevenue =
    salesWithoutCommissionLargeClients * largeClientPrice;
  const salesWithoutCommissionTotalRevenue =
    salesWithoutCommissionSmallClientRevenue +
    salesWithoutCommissionLargeClientRevenue;

  // Sales With Commission calculations
  const salesWithCommissionSmallClients =
    salesWithCommission * salesWithCommissionSmallClientsPercentage;
  const salesWithCommissionLargeClients =
    salesWithCommission - salesWithCommissionSmallClients;
  const salesWithCommissionSmallClientRevenue =
    salesWithCommissionSmallClients * smallClientPrice;
  const salesWithCommissionLargeClientRevenue =
    salesWithCommissionLargeClients * largeClientPrice;
  const salesWithCommissionTotalRevenue =
    salesWithCommissionSmallClientRevenue +
    salesWithCommissionLargeClientRevenue;

  // Commission calculations
  let mentorCommission;
  if (isFixedCommission) {
    mentorCommission = salesWithCommission * commissionValue;
  } else {
    mentorCommission =
      (salesWithCommission *
        (salesWithCommissionSmallClientsPercentage * smallClientPrice +
          (1 - salesWithCommissionSmallClientsPercentage) * largeClientPrice) *
        commissionValue) /
      100;
  }

  const totalClients = salesWithoutCommission + salesWithCommission;
  const totalRevenue =
    salesWithoutCommissionTotalRevenue + salesWithCommissionTotalRevenue;
  const ipFee = totalRevenue * ipFeePercentage;
  const profitBeforeTax =
    totalRevenue - (ipFee + developerTotalCost + overhead + mentorCommission);
  const taxes = profitBeforeTax * taxRate;
  const netProfit = profitBeforeTax - taxes;

  return {
    totalClients,
    totalRevenue,
    mentorCommission,
    profitBeforeTax,
    netProfit,
  };
}

function displayResults(metrics) {
  // Extract metrics for clarity
  const {
    totalClients,
    totalRevenue,
    mentorCommission,
    profitBeforeTax,
    netProfit,
  } = metrics;

  // Update the relevant elements with the calculated metrics
  document.getElementById("totalClients").innerText = totalClients.toFixed(0);
  document.getElementById("totalRevenue").innerText = totalRevenue.toFixed(0);
  document.getElementById("mentorCommission").innerText =
    mentorCommission.toFixed(0);
  document.getElementById("profitBeforeTax").innerText =
    profitBeforeTax.toFixed(0);
  document.getElementById("netProfit").innerText = netProfit.toFixed(0);

  // If you have other elements to update or other display logic, you'd put it here.

  // For the chart display:
  createFixedChart(totalRevenue, mentorCommission, netProfit);
}

function createFixedChart(totalRevenue, mentorEarnings, companyProfit) {
  const ctx = document.getElementById("earningsChart").getContext("2d");

  // Check and destroy any existing chart instance
  if (window.myChart instanceof Chart) {
    window.myChart.destroy();
  }

  // Create a new chart instance
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Revenue", "Commission", "Net Profit"],
      datasets: [
        {
          label: "Amount",
          data: [totalRevenue, mentorEarnings, companyProfit],
          backgroundColor: [
            "rgba(255, 206, 86, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgb(60, 179, 113, 0.2)",
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgb(60, 179, 113, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function calculateAndDisplay() {
  const inputValues = getInputValues();
  const results = calculateMetrics(inputValues);
  displayResults(results);
}

document
  .getElementById("calculateButton")
  .addEventListener("click", calculateAndDisplay);
