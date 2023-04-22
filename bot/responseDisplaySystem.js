//this implementation written with GPT4
const typeWriterQueue = [];
let currentSpeed = 100; // Default typing speed
let isProcessing = false; // Indicates whether the queue is being processed
const checkInterval = 100; // Set to fastest 'safe' interval

//once the user clicks the send button or pushes enter and a response element is generated call:
//  processTypeWriterQueue(newElementId, true);
//this will have the process check for new strings added to the typeWriterQueue array and will send
//them to the screen when a text response is received from openAI, so just push like so:
//  typeWriterQueue.push({ text: 'That reminds me of a joke... ', stringType: 'buyTime' });
//  typeWriterQueue.push({ text: 'You have taken 36 credit hours so far', stringType: 'actualAnswer' });
//sending an actual answer turns off the listener

function typeWriterEffect(elementId, text, speed, onComplete, stringType) {
    let i = 0;
    const element = document.getElementById(elementId);

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (typeof onComplete === 'function') {
            onComplete();
        }
    }

    if (stringType === 'actualAnswer') {
        speed = 50; // Faster typing speed for 'actualAnswer' type
    }

    type();
}

function processTypeWriterQueue(elementId) {
    if (!isProcessing) {
        isProcessing = true;
        processQueue(elementId);
    }
}

function processQueue(elementId, stopOnActualAnswer = false) {
    if (typeWriterQueue.length > 0) {
        const { text, stringType } = typeWriterQueue.shift();
        const speed = stringType === 'actualAnswer' ? 50 : currentSpeed;
        typeWriterEffect(elementId, text, speed, () => {
            if (!stopOnActualAnswer || stringType !== 'actualAnswer') {
                processQueue(elementId, stopOnActualAnswer);
            } else {
                isProcessing = false;
            }
        }, stringType);
    } else {
        setTimeout(() => {
            processQueue(elementId, stopOnActualAnswer);
        }, checkInterval);
    }
}

