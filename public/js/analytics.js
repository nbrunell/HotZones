////////////////////////////////////////////////////////////////
//DASHBOARD.JS
//THIS IS YOUR "CONTROLLER", IT ACTS AS THE MIDDLEMAN
// BETWEEN THE MODEL (datamodel.js) AND THE VIEW (dashboard.html)
////////////////////////////////////////////////////////////////


//ADD ALL EVENT LISTENERS INSIDE DOMCONTENTLOADED
//AT THE BOTTOM OF DOMCONTENTLOADED, ADD ANY CODE THAT NEEDS TO RUN IMMEDIATELY
document.addEventListener('DOMContentLoaded', () => {

    //////////////////////////////////////////
    //ELEMENTS TO ATTACH EVENT LISTENERS
    //////////////////////////////////////////

    //////////////////////////////////////////
    //END ELEMENTS TO ATTACH EVENT LISTENERS
    //////////////////////////////////////////


    //////////////////////////////////////////
    //EVENT LISTENERS
    //////////////////////////////////////////

    //////////////////////////////////////////
    //END EVENT LISTENERS
    //////////////////////////////////////////


    //////////////////////////////////////////////////////
    //CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
    //////////////////////////////////////////////////////
    // Initial check for the token
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '/';
    } else {
        DataModel.setToken(token);
        //do something
    }
    //////////////////////////////////////////
    //END CODE THAT NEEDS TO RUN IMMEDIATELY AFTER PAGE LOADS
    //////////////////////////////////////////
});
//END OF DOMCONTENTLOADED


//////////////////////////////////////////
//FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////

//////////////////////////////////////////
//END FUNCTIONS TO MANIPULATE THE DOM
//////////////////////////////////////////

// Below is js for hamburger menu//
const hamburger = document.getElementById('hamburger')
const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')

let menuOpen = false

function openMenu() {
  menuOpen = true
  overlay.style.display = 'block'
  sidebar.style.width = '250px'
}

function closeMenu() {
  menuOpen = false
  overlay.style.display = 'none'
  sidebar.style.width = '0px'
}

hamburger.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu()
  }
})

overlay.addEventListener('click', function () {
  if (menuOpen) {
    closeMenu()
  }
})
// END OF MENU//

/*
//Line Chart: Basketball Shot Accuracy Over Time//
const ctxLineChart = document.getElementById('accuracyChart').getContext('2d');
let accuracyChart;

const fetchData = (filterType) => {
    return new Promise((resolve) => {
        let data = [];
        if (filterType === 'day') {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (let i = 0; i < 7; i++) {
                data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'month') {
            const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
            for (let i = 0; i < daysInMonth.length; i++) {
                data.push({ time: `${daysInMonth[i]}`, accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'week') {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (let i = 0; i < 7; i++) {
                data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'all-time') {
            for (let i = 0; i < 10; i++) {
                data.push({ time: `Game ${i + 1}`, accuracy: Math.random() * 100 });
            }
        }
        resolve(data);
    });
};

const createLineChart = (data) => {
    const labels = data.map(d => d.time);
    const accuracyData = data.map(d => d.accuracy);

    if (accuracyChart) {
        accuracyChart.destroy();
    }

    accuracyChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Basketball Shot Accuracy (%)',
                data: accuracyData,
                borderColor: '#ff5733',
                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Average Basketball Shot Accuracy Over Time',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                },
                legend: {
                    position: 'right',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

// Event listeners for the filter selects
document.getElementById('dayFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('weekFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('monthFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('allTimeFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});


 // --- Bar Chart: Basketball Shot Zones ---
 const ctxBarChart = document.getElementById('shotZonesChart').getContext('2d');
 let shotZonesChart;

 const shotData = [
     { zone: 'Left Corner', shots: 15 },
     { zone: 'Left Wing', shots: 22 },
     { zone: 'Top of the Key', shots: 10 },
     { zone: 'Right Wing', shots: 30 },
     { zone: 'Right Corner', shots: 18 },
     { zone: 'Right Baseline', shots: 27 },
     { zone: 'Right Mid', shots: 12 },
     { zone: 'Free Throw', shots: 25 },
     { zone: 'Left Mid', shots: 8 },
     { zone: 'Left Baseline', shots: 20 },
     { zone: 'Paint', shots: 17 },
 ];

 const createBarChart = (data) => {
     const zones = data.map(d => d.zone);
     const shots = data.map(d => d.shots);

     if (shotZonesChart) {
         shotZonesChart.destroy();
     }

     shotZonesChart = new Chart(ctxBarChart, {
         type: 'bar',
         data: {
             labels: zones,
             datasets: [{
                 label: 'Number of Shots Taken in Each Zone',
                 data: shots,
                 backgroundColor: '#ff5733',
                 borderColor: '#ff5733',
                 borderWidth: 1,
             }]
         },
         options: {
             plugins: {
                 title: {
                     display: true,
                     text: 'Total Number of Shots by Zone',
                     font: {
                         size: 18,
                         weight: 'bold',
                     },
                 },
                 legend: {
                     position: 'right',
                 }
             },
             scales: {
                 x: {
                     title: {
                         display: true,
                         text: 'Basketball Court Zones'
                     }
                 },
                 y: {
                     title: {
                         display: true,
                         text: 'Number of Shots'
                     },
                     min: 0,
                     ticks: {
                         stepSize: 5,
                     }
                 }
             },
             responsive: true,
             maintainAspectRatio: false
         }
     });
 };

 // Initialize both charts
 fetchData('all-time', '').then(createLineChart);
 createBarChart(shotData);
 */

 /*
 // --- Line Chart: Basketball Shot Accuracy Over Time ---
const ctxLineChart = document.getElementById('accuracyChart').getContext('2d');
let accuracyChart;

const fetchData = (filterType) => {
    return new Promise((resolve) => {
        let data = [];
        if (filterType === 'day') {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (let i = 0; i < 7; i++) {
                data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'month') {
            const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
            for (let i = 0; i < daysInMonth.length; i++) {
                data.push({ time: `${daysInMonth[i]}`, accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'week') {
            const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            for (let i = 0; i < 7; i++) {
                data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
            }
        } else if (filterType === 'all-time') {
            for (let i = 0; i < 10; i++) {
                data.push({ time: `Game ${i + 1}`, accuracy: Math.random() * 100 });
            }
        }
        resolve(data);
    });
};

const createLineChart = (data) => {
    const labels = data.map(d => d.time);
    const accuracyData = data.map(d => d.accuracy);

    if (accuracyChart) {
        accuracyChart.destroy();
    }

    accuracyChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Basketball Shot Accuracy (%)',
                data: accuracyData,
                borderColor: '#ff5733',
                backgroundColor: 'rgba(255, 87, 51, 0.2)',
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Average Basketball Shot Accuracy Over Time',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                },
                legend: {
                    position: 'right',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Accuracy (%)'
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

// Event listeners for the filter selects
document.getElementById('dayFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('weekFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('monthFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

document.getElementById('allTimeFilter').addEventListener('change', (e) => {
    const filterType = e.target.value;
    fetchData(filterType).then(createLineChart);
});

// --- Bar Chart: Basketball Shot Zones ---
const ctxBarChart = document.getElementById('shotZonesChart').getContext('2d');
let shotZonesChart;

// Placeholder function to simulate dynamic shot data fetch (e.g., from a database)
const fetchShotData = () => {
    return new Promise((resolve) => {
        // Simulate database or API response here with dynamic data
        const data = [
            { zone: 'Left Corner', shots: Math.floor(Math.random() * 50) },
            { zone: 'Left Wing', shots: Math.floor(Math.random() * 50) },
            { zone: 'Top of the Key', shots: Math.floor(Math.random() * 50) },
            { zone: 'Right Wing', shots: Math.floor(Math.random() * 50) },
            { zone: 'Right Corner', shots: Math.floor(Math.random() * 50) },
            { zone: 'Right Baseline', shots: Math.floor(Math.random() * 50) },
            { zone: 'Right Mid', shots: Math.floor(Math.random() * 50) },
            { zone: 'Free Throw', shots: Math.floor(Math.random() * 50) },
            { zone: 'Left Mid', shots: Math.floor(Math.random() * 50) },
            { zone: 'Left Baseline', shots: Math.floor(Math.random() * 50) },
            { zone: 'Paint', shots: Math.floor(Math.random() * 50) }
        ];
        resolve(data);
    });
};

const createBarChart = (data) => {
    const zones = data.map(d => d.zone);
    const shots = data.map(d => d.shots);

    if (shotZonesChart) {
        shotZonesChart.destroy();
    }

    shotZonesChart = new Chart(ctxBarChart, {
        type: 'bar',
        data: {
            labels: zones,
            datasets: [{
                label: 'Number of Shots Taken in Each Zone',
                data: shots,
                backgroundColor: '#ff5733',
                borderColor: '#ff5733',
                borderWidth: 1,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Total Number of Shots by Zone',
                    font: {
                        size: 18,
                        weight: 'bold',
                    },
                },
                legend: {
                    position: 'right',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Basketball Court Zones'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Shots'
                    },
                    min: 0,
                    ticks: {
                        stepSize: 5,
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

// Fetch shot data (simulating dynamic fetch here)
fetchShotData().then(createBarChart);

// Initialize both charts
fetchData('all-time').then(createLineChart);
*/

// LAST CURRENT WORKING CODE
// document.addEventListener('DOMContentLoaded', function() {
//     const ctxLineChart = document.getElementById('accuracyChart').getContext('2d');
//     const ctxBarChart = document.getElementById('shotZonesChart').getContext('2d');


//     let accuracyChart;
//     let shotZonesChart;


//     // const fetchData = (filterType) => {
//     //     return new Promise((resolve) => {
//     //         let data = [];
//     //         if (filterType === 'all-time') {
//     //             for (let i = 0; i < 10; i++) {
//     //                 data.push({ time: `Game ${i + 1}`, accuracy: Math.random() * 100 });
//     //             }
//     //         }
//     //         resolve(data);
//     //     });
//     // };

//     const fetchData = (filterType) => {
//         return new Promise((resolve) => {
//             let data = [];
//             if (filterType === 'day') {
//                 const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//                 for (let i = 0; i < 7; i++) {
//                     data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
//                 }
//             } else if (filterType === 'month') {
//                 const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
//                 for (let i = 0; i < daysInMonth.length; i++) {
//                     data.push({ time: `${daysInMonth[i]}`, accuracy: Math.random() * 100 });
//                 }
//             } else if (filterType === 'week') {
//                 const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//                 for (let i = 0; i < 7; i++) {
//                     data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
//                 }
//             } else if (filterType === 'all-time') {
//                 // Generate 10 timestamps (for the last 10 games or entries)
//                 const currentDate = new Date(); // Get the current date
//                 for (let i = 0; i < 10; i++) {
//                     // Subtract `i` days from the current date to create different timestamps
//                     const timestamp = new Date(currentDate);
//                     timestamp.setDate(currentDate.getDate() - i); // Go back 'i' days
    
//                     // Format the timestamp into a readable date string (you can adjust format as needed)
//                     const formattedDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
    
//                     data.push({
//                         time: formattedDate,  // Display formatted timestamp
//                         accuracy: Math.random() * 100,  // Random accuracy value for illustration
//                     });
//                 }
//             }
//             resolve(data);
//         });
//     };

//     const fetchShotData = () => {
//         return new Promise((resolve) => {
//             const data = [
//                 { zone: 'Left Corner', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Left Wing', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Top of the Key', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Right Wing', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Right Corner', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Right Baseline', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Right Mid', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Free Throw', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Left Mid', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Left Baseline', shots: Math.floor(Math.random() * 50) },
//                 { zone: 'Paint', shots: Math.floor(Math.random() * 50) }
//             ];
//             resolve(data);
//         });
//     };

//     // const createLineChart = (data) => {
//     //     const labels = data.map(d => d.time);
//     //     const accuracyData = data.map(d => d.accuracy);

//     //     if (accuracyChart) {
//     //         accuracyChart.destroy();
//     //     }

//     //     accuracyChart = new Chart(ctxLineChart, {
//     //         type: 'line',
//     //         data: {
//     //             labels: labels,
//     //             datasets: [{
//     //                 label: 'Basketball Shot Accuracy (%)',
//     //                 data: accuracyData,
//     //                 borderColor: '#ff5733',
//     //                 backgroundColor: 'rgba(255, 87, 51, 0.2)',
//     //                 fill: true,
//     //                 tension: 0.4,
//     //             }]
//     //         },
//     //         options: {
//     //             responsive: true,
//     //             maintainAspectRatio: false,
//     //         }
//     //     });
//     // };

//     const createLineChart = (data) => {
//         const labels = data.map(d => d.time);
//         const accuracyData = data.map(d => d.accuracy);
    
//         if (accuracyChart) {
//             accuracyChart.destroy();
//         }
    
//         accuracyChart = new Chart(ctxLineChart, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: 'Basketball Shot Accuracy (%)',
//                     data: accuracyData,
//                     borderColor: '#ff5733',
//                     backgroundColor: 'rgba(255, 87, 51, 0.2)',
//                     fill: true,
//                     tension: 0.4,
//                 }]
//             },
//             options: {
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Average Basketball Shot Accuracy Over Time',
//                         font: {
//                             size: 18,
//                             weight: 'bold',
//                         },
//                     },
//                     legend: {
//                         position: 'right',
//                     }
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Time'
//                         }
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Accuracy (%)'
//                         },
//                         min: 0,
//                         max: 100,
//                         ticks: {
//                             stepSize: 10
//                         }
//                     }
//                 },
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     };
    
//     // Event listeners for the filter selects
//     document.getElementById('dayFilter').addEventListener('change', (e) => {
//         const filterType = e.target.value;
//         fetchData(filterType).then(createLineChart);
//     });
    
//     // document.getElementById('weekFilter').addEventListener('change', (e) => {
//     //     const filterType = e.target.value;
//     //     fetchData(filterType).then(createLineChart);
//     // });
    
//     // document.getElementById('monthFilter').addEventListener('change', (e) => {
//     //     const filterType = e.target.value;
//     //     fetchData(filterType).then(createLineChart);
//     // });
    
//     // document.getElementById('allTimeFilter').addEventListener('change', (e) => {
//     //     const filterType = e.target.value;
//     //     fetchData(filterType).then(createLineChart);
//     // });
    
//     // --- Bar Chart: Basketball Shot Zones ---
//     // const ctxBarChart = document.getElementById('shotZonesChart').getContext('2d');
//     // let shotZonesChart;
    

//     // const createBarChart = (data) => {
//     //     const zones = data.map(d => d.zone);
//     //     const shots = data.map(d => d.shots);

//     //     if (shotZonesChart) {
//     //         shotZonesChart.destroy();
//     //     }

//     //     shotZonesChart = new Chart(ctxBarChart, {
//     //         type: 'bar',
//     //         data: {
//     //             labels: zones,
//     //             datasets: [{
//     //                 label: 'Number of Shots Taken in Each Zone',
//     //                 data: shots,
//     //                 backgroundColor: '#ff5733',
//     //                 borderColor: '#ff5733',
//     //                 borderWidth: 1,
//     //             }]
//     //         },
//     //         options: {
//     //             responsive: true,
//     //             maintainAspectRatio: false,
//     //         }
//     //     });
//     // };
//     const createBarChart = (data) => {
//         const zones = data.map(d => d.zone);
//         const shots = data.map(d => d.shots);
    
//         if (shotZonesChart) {
//             shotZonesChart.destroy();
//         }
    
//         shotZonesChart = new Chart(ctxBarChart, {
//             type: 'bar',
//             data: {
//                 labels: zones,
//                 datasets: [{
//                     label: 'Number of Shots Taken in Each Zone',
//                     data: shots,
//                     backgroundColor: '#ff5733',
//                     borderColor: '#ff5733',
//                     borderWidth: 1,
//                 }]
//             },
//             options: {
//                 plugins: {
//                     title: {
//                         display: true,
//                         text: 'Total Number of Shots by Zone',
//                         font: {
//                             size: 18,
//                             weight: 'bold',
//                         },
//                     },
//                     legend: {
//                         position: 'right',
//                     }
//                 },
//                 scales: {
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Basketball Court Zones'
//                         }
//                     },
//                     y: {
//                         title: {
//                             display: true,
//                             text: 'Number of Shots'
//                         },
//                         min: 0,
//                         ticks: {
//                             stepSize: 5,
//                         }
//                     }
//                 },
//                 responsive: true,
//                 maintainAspectRatio: false
//             }
//         });
//     };

    
//     // Fetch and create the charts
//     fetchData('all-time').then(createLineChart);
//     fetchShotData().then(createBarChart);
// });

// END OF lAST CURRENT WORKING CODE

// // --- Radar Chart: Basketball Shot Accuracy by Zones
// const ctxRadarChart = document.getElementById('accuracyRadarChart').getContext('2d');
// let accuracyRadarChart;

// const radarData = [
//     { zone: 'Left Corner', accuracy: Math.random() * 100 },
//     { zone: 'Left Wing', accuracy: Math.random() * 100 },
//     { zone: 'Top of the Key', accuracy: Math.random() * 100 },
//     { zone: 'Right Wing', accuracy: Math.random() * 100 },
//     { zone: 'Right Corner', accuracy: Math.random() * 100 },
//     { zone: 'Right Baseline', accuracy: Math.random() * 100 },
//     { zone: 'Right Mid', accuracy: Math.random() * 100 },
//     { zone: 'Free Throw', accuracy: Math.random() * 100 },
//     { zone: 'Left Mid', accuracy: Math.random() * 100 },
//     { zone: 'Left Baseline', accuracy: Math.random() * 100 },
//     { zone: 'Paint', accuracy: Math.random() * 100 }
// ];

// const createRadarChart = (data) => {
//     const labels = data.map(d => d.zone);
//     const accuracyData = data.map(d => d.accuracy);

//     if (accuracyRadarChart) {
//         accuracyRadarChart.destroy();
//     }

//     accuracyRadarChart = new Chart(ctxRadarChart, {
//         type: 'radar',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Basketball Shot Accuracy by Zones',
//                 data: accuracyData,
//                 backgroundColor: 'rgba(255, 87, 51, 0.2)',  // Light red fill
//                 borderColor: '#ff5733',  // Dark red border
//                 borderWidth: 2,
//                 tension: 0.4,
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 r: {
//                     min: 0,
//                     max: 100,
//                     ticks: {
//                         stepSize: 10,
//                     },
//                     angleLines: {
//                         display: true,
//                     },
//                     suggestedMin: 0,
//                     suggestedMax: 100,
//                 }
//             },
//             plugins: {
//                 title: {
//                     display: true,
//                     text: 'Basketball Shot Accuracy by Zones',
//                     font: {
//                         size: 18,
//                         weight: 'bold',
//                     },
//                 }
//             }
//         }
//     });
// };

// // Call createRadarChart with radarData to initialize the radar chart
// createRadarChart(radarData);

document.addEventListener('DOMContentLoaded', function() {
    const ctxLineChart = document.getElementById('accuracyChart').getContext('2d');
    const ctxBarChart = document.getElementById('shotZonesChart').getContext('2d');
    const ctxRadarChart = document.getElementById('shotAccuracyRadarChart').getContext('2d');  // New context for the radar chart

    let accuracyChart;
    let shotZonesChart;
    let radarChart; // New variable to hold the radar chart instance

    const fetchData = (filterType) => {
        return new Promise((resolve) => {
            let data = [];
            if (filterType === 'day') {
                const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                for (let i = 0; i < 7; i++) {
                    data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
                }
            } else if (filterType === 'month') {
                const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1-31
                for (let i = 0; i < daysInMonth.length; i++) {
                    data.push({ time: `${daysInMonth[i]}`, accuracy: Math.random() * 100 });
                }
            } else if (filterType === 'week') {
                const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                for (let i = 0; i < 7; i++) {
                    data.push({ time: daysOfWeek[i], accuracy: Math.random() * 100 });
                }
            } else if (filterType === 'all-time') {
                const currentDate = new Date(); // Get the current date
                for (let i = 0; i < 10; i++) {
                    const timestamp = new Date(currentDate);
                    timestamp.setDate(currentDate.getDate() - i); // Go back 'i' days
                    const formattedDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD format
                    data.push({
                        time: formattedDate,
                        accuracy: Math.random() * 100,
                    });
                }
            }
            resolve(data);
        });
    };

    const fetchShotData = () => {
        return new Promise((resolve) => {
            const data = [
                { zone: 'Left Corner', shots: Math.floor(Math.random() * 50) },
                { zone: 'Left Wing', shots: Math.floor(Math.random() * 50) },
                { zone: 'Top of the Key', shots: Math.floor(Math.random() * 50) },
                { zone: 'Right Wing', shots: Math.floor(Math.random() * 50) },
                { zone: 'Right Corner', shots: Math.floor(Math.random() * 50) },
                { zone: 'Right Baseline', shots: Math.floor(Math.random() * 50) },
                { zone: 'Right Mid', shots: Math.floor(Math.random() * 50) },
                { zone: 'Free Throw', shots: Math.floor(Math.random() * 50) },
                { zone: 'Left Mid', shots: Math.floor(Math.random() * 50) },
                { zone: 'Left Baseline', shots: Math.floor(Math.random() * 50) },
                { zone: 'Paint', shots: Math.floor(Math.random() * 50) }
            ];
            resolve(data);
        });
    };

    // Line chart creation
    const createLineChart = (data) => {
        const labels = data.map(d => d.time);
        const accuracyData = data.map(d => d.accuracy);

        if (accuracyChart) {
            accuracyChart.destroy();
        }

        accuracyChart = new Chart(ctxLineChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Basketball Shot Accuracy (%)',
                    data: accuracyData,
                    borderColor: '#ff5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Basketball Shot Accuracy Over Time',
                        font: { size: 18, weight: 'bold' },
                    },
                    legend: { position: 'right' }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Time' }
                    },
                    y: {
                        title: { display: true, text: 'Accuracy (%)' },
                        min: 0, max: 100, ticks: { stepSize: 10 }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    // Event listeners for the filter selects
    document.getElementById('dayFilter').addEventListener('change', (e) => {
        const filterType = e.target.value;
        fetchData(filterType).then(createLineChart);
    });

    // Bar chart creation
    const createBarChart = (data) => {
        const zones = data.map(d => d.zone);
        const shots = data.map(d => d.shots);

        if (shotZonesChart) {
            shotZonesChart.destroy();
        }

        shotZonesChart = new Chart(ctxBarChart, {
            type: 'bar',
            data: {
                labels: zones,
                datasets: [{
                    label: 'Number of Shots Taken in Each Zone',
                    data: shots,
                    backgroundColor: '#ff5733',
                    borderColor: '#ff5733',
                    borderWidth: 1,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Total Number of Shots by Zone',
                        font: { size: 18, weight: 'bold' },
                    },
                    legend: { position: 'right' }
                },
                scales: {
                    x: { title: { display: true, text: 'Basketball Court Zones' } },
                    y: { title: { display: true, text: 'Number of Shots' }, min: 0, ticks: { stepSize: 5 } }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    // Radar chart creation
    const createRadarChart = (data) => {
        const zones = data.map(d => d.zone);
        const accuracy = data.map(d => d.shots); // Using the number of shots for simplicity

        if (radarChart) {
            radarChart.destroy();
        }

        radarChart = new Chart(ctxRadarChart, {
            type: 'radar',
            data: {
                labels: zones,
                datasets: [{
                    label: 'Shot Accuracy (%)',
                    data: accuracy,
                    borderColor: '#ff5733',
                    backgroundColor: 'rgba(255, 87, 51, 0.2)',
                    borderWidth: 1,
                    fill: true
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Shot Accuracy Radar Chart',
                        font: { size: 18, weight: 'bold' },
                    },
                    legend: { position: 'right' }
                },
                scales: {
                    r: {
                        min: 0, max: 100, ticks: { stepSize: 20 }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    // Fetch and create the charts
    fetchData('all-time').then(createLineChart);
    fetchShotData().then(createBarChart);
    fetchShotData().then(createRadarChart); // Create the radar chart as well
});

