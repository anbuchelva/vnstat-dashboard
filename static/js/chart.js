function formatDateTime(dateString) {
  const dateObj = new Date(dateString);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // This ensures a 24-hour format
  };

  return dateObj.toLocaleTimeString('en-US', options);
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

// Function to format bytes to human-readable units (KB, MB, GB, TB)
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to extract bootstrap colors
function getBootstrapColor(colorName) {
  const root = document.documentElement;
  const colorVar = `--bs-${colorName}`;
  return getComputedStyle(root).getPropertyValue(colorVar);
}

const primaryColor = getBootstrapColor('primary');
const secondaryColor = getBootstrapColor('secondary');
const textColor = '#B0B0B0';
const gridColor = '#b0b0b033';

// 5 minute chart
const fiveMinChartCtx = document.getElementById('fiveMinChart').getContext('2d');
new Chart(fiveMinChartCtx, {
  type: 'bar',
  data: {
    labels: fiveMinLabels.map((label) => formatDateTime(label)),
    datasets: [
      {
        label: 'Received',
        data: fiveMinReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: fiveMinSentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});

// 1 hour chart
const hourlyChartCtx = document.getElementById('hourChart').getContext('2d');
new Chart(hourlyChartCtx, {
  type: 'bar',
  data: {
    labels: hourLabels.map((label) => formatDateTime(label)),
    datasets: [
      {
        label: 'Received',
        data: hourReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: hourSentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});

// 30 day chart
const dayChartCtx = document.getElementById('dayChart').getContext('2d');
new Chart(dayChartCtx, {
  type: 'bar',
  data: {
    labels: dayLabels.map((label) => formatDate(label)),
    datasets: [
      {
        label: 'Received',
        data: dayReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: daySentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});

// month chart
const monthChartCtx = document.getElementById('monthChart').getContext('2d');
new Chart(monthChartCtx, {
  type: 'bar',
  data: {
    labels: monthLabels.map((label) => formatMonthYear(label)),
    datasets: [
      {
        label: 'Received',
        data: monthReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: monthSentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});

// year chart
const yearChartCtx = document.getElementById('yearChart').getContext('2d');
new Chart(yearChartCtx, {
  type: 'bar',
  data: {
    labels: yearLabels.map((label) => formatYear(label)),
    datasets: [
      {
        label: 'Received',
        data: yearReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: yearSentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});

// top usage
const topChartCtx = document.getElementById('topChart').getContext('2d');
new Chart(topChartCtx, {
  type: 'bar',
  data: {
    labels: topLabels.map((label) => formatDate(label)),
    datasets: [
      {
        label: 'Received',
        data: topReceivedData,
        borderColor: primaryColor,
        backgroundColor: primaryColor,
        fill: true
      },
      {
        label: 'Sent',
        data: topSentData,
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
            return formatBytes(value); // Format the y-axis ticks
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
      }
    }
  }
});
