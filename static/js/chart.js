function formatDateTime(dateString) {
  const dateObj = new Date(dateString);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // This ensures a 24-hour format
  };

  return dateObj.toLocaleTimeString('en-US', options);
}

function formatFullDate(dateString) {
  const dateObj = new Date(dateString);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth() is 0-indexed
  const day = dateObj.getDate().toString().padStart(2, '0');

  // Return the date in yyyy-mm-dd format
  return `${year}-${month}-${day}`;
}

// Function to format date from "YYYY-MM-DD hh:mm:ss" to "MMM-DD hh:mm"
function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const options = { month: 'short', day: '2-digit' };
  return dateObj.toLocaleDateString('en-US', options);
}

// Function to format date from "YYYY-MM-DD hh:mm:ss" to "MMM-YY"
function formatMonthYear(dateString) {
  const dateObj = new Date(dateString);

  const options = { month: 'short', year: '2-digit' };
  return dateObj.toLocaleDateString('en-US', options).replace(' ', '-'); // Format as "MMM-YY"
}

function formatYear(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.getFullYear();
}

function formatBytes(rxArray, txArray) {
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const TB = GB * 1024;
  const PB = TB * 1024;

  // Function to determine the largest unit (based on both rx and tx arrays)
  function getLargestUnit(rxArray, txArray) {
    const summedArray = rxArray.map((rx, index) => rx + txArray[index]);
    let largestValue = Math.max(...summedArray);

    if (largestValue >= PB) return 'PB';
    if (largestValue >= TB) return 'TB';
    if (largestValue >= GB) return 'GB';
    if (largestValue >= MB) return 'MB';
    if (largestValue >= KB) return 'KB';
    return 'bytes';
  }

  // Get the largest unit for both rx and tx arrays
  const unit = getLargestUnit(rxArray, txArray);
  let divisor;

  // Choose the correct divisor based on the unit
  switch (unit) {
    case 'PB':
      divisor = PB;
      break;
    case 'TB':
      divisor = TB;
      break;
    case 'GB':
      divisor = GB;
      break;
    case 'MB':
      divisor = MB;
      break;
    case 'KB':
      divisor = KB;
      break;
    default:
      divisor = 1; // 'bytes'
  }

  // Convert each value in rxArray and txArray by the divisor
  const rx_out = rxArray.map((rx) => (rx / divisor).toFixed(2));
  const tx_out = txArray.map((tx) => (tx / divisor).toFixed(2));

  // Return the result with numeric arrays and the metric
  return {
    rx_out: rx_out,
    tx_out: tx_out,
    metric: unit
  };
}

// Function to extract bootstrap colors
function getBootstrapColor(colorName) {
  const root = document.documentElement;
  const colorVar = `--bs-${colorName}`;
  return getComputedStyle(root).getPropertyValue(colorVar);
}

function getTextColor() {
  const storedTheme = localStorage.getItem('theme');
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = storedTheme;

  if (storedTheme === 'auto') {
    currentTheme = isSystemDark ? 'dark' : 'light';
  } else if (storedTheme === null) {
    currentTheme = isSystemDark ? 'dark' : 'light';
  }

  if (currentTheme === 'dark') {
    return getBootstrapColor('light');
  } else if (currentTheme === 'light') {
    return getBootstrapColor('dark');
  }
}

const primaryColor = getBootstrapColor('primary');
const secondaryColor = getBootstrapColor('secondary');
const textColor = getTextColor();
const gridColor = '#b0b0b033';

const fiveMinuteDataConverted = formatBytes(fiveMinReceivedData, fiveMinSentData);
const hourDataConverted = formatBytes(hourReceivedData, hourSentData);
const dayDataConverted = formatBytes(dayReceivedData, daySentData);
const monthDataConverted = formatBytes(monthReceivedData, monthSentData);
const yearDataConverted = formatBytes(yearReceivedData, yearSentData);
const topDataConverted = formatBytes(topReceivedData, topSentData);

function createChart(ctx, labels, receivedData, sentData, metric, primaryColor, secondaryColor, textColor, gridColor) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Received',
          data: receivedData,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          fill: true
        },
        {
          label: 'Sent',
          data: sentData,
          borderColor: secondaryColor,
          backgroundColor: secondaryColor,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColor
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          stacked: true,
          ticks: {
            callback: function (value) {
              return value + ' ' + metric;
            },
            color: textColor
          },
          grid: {
            color: gridColor
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        },
        tooltip: {
          callbacks: {
            title: function (tooltipItem) {
              return tooltipItem[0].label;
            },
            label: function (tooltipItem) {
              const datasetIndex = tooltipItem.datasetIndex;
              const data = tooltipItem.raw;
              const label = tooltipItem.dataset.label;
              return `${label}: ${data} ${metric}`;
            }
          },
          titleFont: {
            weight: 'bold'
          },
          bodyFont: {
            size: 14
          },
          bodyColor: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderColor: gridColor,
          borderWidth: 1
        }
      }
    }
  });
}

// 5-minute chart
const fiveMinChartCtx = document.getElementById('fiveMinChart').getContext('2d');
createChart(
  fiveMinChartCtx,
  fiveMinLabels.map((label) => formatDateTime(label)).reverse(),
  fiveMinuteDataConverted.rx_out.reverse(),
  fiveMinuteDataConverted.tx_out.reverse(),
  fiveMinuteDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);

// 1-hour chart
const hourlyChartCtx = document.getElementById('hourChart').getContext('2d');
createChart(
  hourlyChartCtx,
  hourLabels.map((label) => formatDateTime(label)).reverse(),
  hourDataConverted.rx_out.reverse(),
  hourDataConverted.tx_out.reverse(),
  hourDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);

// 1-day chart
const dayChartCtx = document.getElementById('dayChart').getContext('2d');
createChart(
  dayChartCtx,
  dayLabels.map((label) => formatDate(label)).reverse(),
  dayDataConverted.rx_out.reverse(),
  dayDataConverted.tx_out.reverse(),
  dayDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);

// 1-month chart
const monthChartCtx = document.getElementById('monthChart').getContext('2d');
createChart(
  monthChartCtx,
  monthLabels.map((label) => formatMonthYear(label)).reverse(),
  monthDataConverted.rx_out.reverse(),
  monthDataConverted.tx_out.reverse(),
  monthDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);

// 1-year chart
const yearChartCtx = document.getElementById('yearChart').getContext('2d');
createChart(
  yearChartCtx,
  yearLabels.map((label) => formatYear(label)).reverse(),
  yearDataConverted.rx_out.reverse(),
  yearDataConverted.tx_out.reverse(),
  yearDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);

// Top usage chart
const topChartCtx = document.getElementById('topChart').getContext('2d');
createChart(
  topChartCtx,
  topLabels.map((label) => formatFullDate(label)),
  topDataConverted.rx_out,
  topDataConverted.tx_out,
  topDataConverted.metric,
  primaryColor,
  secondaryColor,
  textColor,
  gridColor
);
