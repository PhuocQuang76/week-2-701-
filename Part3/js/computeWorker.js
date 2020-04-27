self.onmessage = messageHandler;

function messageHandler(e) {
    let data = e.data;
    let result = 0;
    console.log('Worker: Message received from main script');
    //let result = e.data[0] * e.data[1];

    for(let i = data.start; i <= data.end; i++){
        result += i;
    }


    if (isNaN(result)) {
        self.postMessage('Please write two numbers');
    } else {
        let workerResult = {"index": data.index, "start": data.start,
            "end": data.end, "result":result};
        console.log('Worker: Posting message back to main script');
        self.postMessage(workerResult);
    }
};
