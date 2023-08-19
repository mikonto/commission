function calculateRevenueProfitsForClients(
  salesWithoutCommission,
  salesWithCommission
) {
  //Client info
  const smallClientPrice = Number(
    document.getElementById("smallClientPrice").value
  );
  const largeClientPrice = Number(
    document.getElementById("largeClientPrice").value
  );

  // Costs
  const ipFeePercentage =
    Number(document.getElementById("ipFeePercentage").value) / 100;
  const developerHours = Number(
    document.getElementById("developerHours").value
  );
  const developerHourlyCost = Number(
    document.getElementById("developerHourlyCost").value
  );
  const developerTotalCost = developerHours * developerHourlyCost * 12; // annual cost
  const overhead = Number(document.getElementById("overhead").value) * 12;
  const taxRate = Number(document.getElementById("taxRate").value) / 100;

  // Sales Without Commission

  const salesWithoutCommissionSmallClientsPercentage =
    Number(
      document.getElementById("salesWithoutCommissionSmallClientsPercentage")
        .value
    ) / 100;
  const salesWithoutCommissionSmallClients =
    salesWithoutCommission * salesWithoutCommissionSmallClientsPercentage;
  const salesWithoutCommissionLargeClients =
    salesWithoutCommission - salesWithoutCommissionSmallClients;
  const salesWithoutCommissionSmallClientRevenue =
    salesWithoutCommissionSmallClients * smallClientPrice;

  const salesWithoutCommissionLargeClientRevenue =
    salesWithoutCommissionLargeClients * largeClientPrice;
  let salesWithoutCommissionTotalRevenue =
    salesWithoutCommissionSmallClientRevenue +
    salesWithoutCommissionLargeClientRevenue;

  // Sales With Commission
  const salesWithCommissionSmallClientsPercentage =
    Number(
      document.getElementById("salesWithCommissionSmallClientsPercentage").value
    ) / 100;
  const salesWithCommissionSmallClients =
    salesWithCommission * salesWithCommissionSmallClientsPercentage;
  const salesWithCommissionLargeClients =
    salesWithCommission - salesWithCommissionSmallClients;
  const salesWithCommissionSmallClientRevenue =
    salesWithCommissionSmallClients * smallClientPrice;

  const salesWithCommissionLargeClientRevenue =
    salesWithCommissionLargeClients * largeClientPrice;

  let salesWithCommissionTotalRevenue =
    salesWithCommissionSmallClientRevenue +
    salesWithCommissionLargeClientRevenue;

    console.log({salesWithCommissionTotalRevenue})

  // Commission
  const commissionValue = Number(
    document.getElementById("commissionValue").value
  );
  const isFixedCommission =
    document.getElementById("isFixedCommission").checked;

    let mentorCommission = isFixedCommission ? salesWithCommission * commissionValue : salesWithCommissionTotalRevenue * commissionValue / 100;

      console.log({mentorCommission})


  let totalRevenue =
    salesWithoutCommissionTotalRevenue + salesWithCommissionTotalRevenue;

  const ipFee = totalRevenue * ipFeePercentage;
  let profitBeforeTax =
    totalRevenue - (ipFee + developerTotalCost + overhead + mentorCommission);
  let taxes = profitBeforeTax * taxRate;
  let netProfit = profitBeforeTax - taxes;

  return {
    totalRevenue: totalRevenue,
    mentorCommission: mentorCommission,
    profitBeforeTax: profitBeforeTax,
    netProfit: netProfit,
  };
}

/////////////////////////////////////////

function calculateWithFixedClientAmount() {
  const salesWithoutCommission = Number(
    document.getElementById("salesWithoutCommission").value
  );

  const salesWithCommission = Number(
    document.getElementById("salesWithCommission").value
  );

  const revenueCommissionProfit = calculateRevenueProfitsForClients(
    salesWithoutCommission,
    salesWithCommission
  );

  // Update results
  document.getElementById("totalRevenue").innerText =
    revenueCommissionProfit.totalRevenue.toFixed(2);
  document.getElementById("mentorCommission").innerText =
    revenueCommissionProfit.mentorCommission.toFixed(2);
  document.getElementById("profitBeforeTax").innerText =
    revenueCommissionProfit.profitBeforeTax.toFixed(2);
  document.getElementById("netProfit").innerText =
    revenueCommissionProfit.netProfit.toFixed(2);

  function createFixedChart(mentorEarnings, companyProfit, totalRevenue) {
    const ctx = document.getElementById("earningsChart").getContext("2d");

    if (window.myChart instanceof Chart) {
      window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Total Commission", "Total Revenue", "Total Company Profit"],
        datasets: [
          {
            label: "Amount",
            data: [mentorEarnings, totalRevenue, companyProfit],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgb(60, 179, 113, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
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
  createFixedChart(
    revenueCommissionProfit.mentorCommission,
    revenueCommissionProfit.netProfit,
    revenueCommissionProfit.totalRevenue
  );
}
