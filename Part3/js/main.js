
let maxNumber = document.getElementById("maxNumber");
let arrValues = [];
let total = 0;

let numberWorker = document.getElementById("workerNumber");

init = () => {
    let startButton = document.getElementById("startButton");
    startButton.addEventListener("click",  start = () => {
        let myWorkers = intializeWorkers(numberWorker);
        myWorkers.map((worker, index) => {
            let start = index * 1000 + 1;
            let end = 1000 * (index + 1);
            worker.postMessage({"index":index, "start": start, "end": end});
        });
    },{once : true});
};

window.onload = init;

// The WORKER
// Handle messages received from the Web Worker
function intializeWorkers(numberWorker) {
    let numberOfWorkers = parseInt(numberWorker.value);
    let myWorkers = [];
    for(let i = 0; i < numberOfWorkers; i++) {
        //arrValues.push[{}];
        let worker = new Worker("./js/computeWorker.js");
        myWorkers.push(worker);

        worker.onmessage = handleReceipt;
    }
    return myWorkers;
}

function handleReceipt(event) {
    let items = document.getElementById("displayMessage");
    let item = document.createElement("li");
    item.innerHTML = JSON.stringify(event.data);
    items.appendChild(item);

    arrValues[event.data.index] = event.data;

    //calculate total
    total += event.data.result;
    let totalResult = document.getElementById("accumulatedResult");
    totalResult.innerHTML = total;

    //Add to Local Storage
    window.localStorage.setItem('values', JSON.stringify(arrValues));


    //Display to #displayStorage
    let itemsS = document.getElementById("displayStorage");
    let itemS = document.createElement("li");
    itemS.innerHTML = JSON.stringify(arrValues);
    itemsS.appendChild(itemS);

    console.log(JSON.stringify(arrValues));
}

// function start(e){
//
//     let myWorkers = intializeWorkers(numberWorker);
//     myWorkers.map((worker, index) => {
//         let start = index * 1000 + 1;
//         let end = 1000 * (index + 1);
//         worker.postMessage({"index":index, "start": start, "end": end});
//     });
// }
//


