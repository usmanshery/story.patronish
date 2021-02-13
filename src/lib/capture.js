import Recorder from 'js-audio-recorder';

const FRAME_RATE = 24;
const INTERVAL = 1000 / FRAME_RATE;

const constraints = {
    video: {
        facingMode: 'user'
    }
};

export default class Capture {
    constructor(videoElement, cb) {
        this.sensor = document.createElement('canvas');
        this.viewfinder = videoElement;
        this.images = [];
        this.audioRecorder = null;

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
                this.stream = stream;
                this.viewfinder.srcObject = stream;
                this.audioRecorder = new Recorder();
            })
            .then(() => cb())
            .catch(error => {
                console.error("MediaDevices failed with: ", error);
            });
    }

    startRecording = () => {
        this.setDimensions();
        this.audioRecorder.start().then(() => {
            this.captureImagesFromCanvas();
        });
    }

    setDimensions = () => {
        // ffmpeg will only allow even number dimensions, so make them even
        const {
            sensor,
            viewfinder
        } = this;
        sensor.width = viewfinder.width % 2 !== 1 ?
            viewfinder.width :
            viewfinder.width - 1;
        sensor.height = viewfinder.height % 2 !== 1 ?
            viewfinder.height :
            viewfinder.height - 1;
    }

    sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
      

    stopRecording = () => {
        return new Promise((resolve, reject) => {
            clearInterval(this.interval);
            this.audioRecorder.stop();
            // this.audioRecorder.downloadWAV('testaudio');
            // this.audioRecorder.play();
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            // console.log("waiting for 10 sec");
            // this.sleep(20000);
            // console.log("wait over");
            resolve({
                rawData: {
                    images: this.images,
                    playbackInterval: INTERVAL,
                    audioRecorder: this.audioRecorder,
                    videoWidth: this.viewfinder.videoWidth,
                    videoHeight: this.viewfinder.videoHeight
                }
            });
        });
    }

    captureImagesFromCanvas = () => {
        const context = this.sensor.getContext("2d");

        // console.log("--- $$$ --- " + this.viewfinder.width + " , " + this.viewfinder.height);
        // console.log("--- $$$ --- " + this.sensor.width + " , " + this.sensor.height);

        this.interval = setInterval(() => {
            context.drawImage(this.viewfinder, 0, 0, this.sensor.width, this.sensor.height);
            const url = this.sensor.toDataURL("image/jpeg");
            this.images.push({
                url
            });
            // this.images.push({
            //     url
            // });
            // console.log("push ", this.images.length);
            // console.log("push url ", this.images.length);
            // this.sensor.toBlob(
            //     (blob) => this.push(url, blob),
            //     "image/png");
            // this.sensor.toBlob(
            //     (blob) => {
            //         // this.images.push({url,blob});
            //         this.images[this.images.length] = {url, blob};
            //     },
            //     "image/png");

        }, INTERVAL);
    }

    // push = (url, blob) => {
    //     console.log("push url ", this.images.length);
    //     this.images.push({
    //         url,
    //         blob
    //     });
    //     console.log("pushed");
    // }
}
// import Recorder from 'js-audio-recorder';

// const FRAME_RATE = 24;
// const INTERVAL = 1000 / FRAME_RATE;

// const constraints = {
//     video: {
//         facingMode: 'user'
//     }
// };

// export default class Capture {
//     constructor(videoElement, cb) {
//         this.sensor = document.createElement('canvas');
//         this.viewfinder = videoElement;
//         this.images = [];
//         this.audioRecorder = null;

//         navigator.mediaDevices
//             .getUserMedia(constraints)
//             .then(stream => {
//                 this.stream = stream;
//                 this.viewfinder.srcObject = stream;
//                 this.audioRecorder = new Recorder();
//             })
//             .then(() => cb())
//             .catch(error => {
//                 console.error("MediaDevices failed with: ", error);
//             });
//     }

//     startRecording = () => {
//         this.setDimensions();
//         this.audioRecorder.start().then(() => {
//             this.captureImagesFromCanvas();
//         });
//     }

//     setDimensions = () => {
//         // ffmpeg will only allow even number dimensions, so make them even
//         const {
//             sensor,
//             viewfinder
//         } = this;
//         sensor.width = viewfinder.width % 2 !== 1 ?
//             viewfinder.width :
//             viewfinder.width - 1;
//         sensor.height = viewfinder.height % 2 !== 1 ?
//             viewfinder.height :
//             viewfinder.height - 1;
//     }

//     stopRecording = () => {
//         return new Promise((resolve, reject) => {
//             clearInterval(this.interval);
//             this.audioRecorder.stop();
//             // this.audioRecorder.downloadWAV('testaudio');
//             // this.audioRecorder.play();
//             this.stream.getTracks().forEach(track => {
//                 track.stop();
//             });
//             resolve({
//                 rawData: {
//                     images: this.images,
//                     playbackInterval: INTERVAL,
//                     audioRecorder: this.audioRecorder,
//                     videoWidth: this.viewfinder.videoWidth,
//                     videoHeight: this.viewfinder.videoHeight
//                 }
//             });
//         });
//     }

//     captureImagesFromCanvas = () => {
//         const context = this.sensor.getContext("2d");

//         // console.log("--- $$$ --- " + this.viewfinder.width + " , " + this.viewfinder.height);
//         // console.log("--- $$$ --- " + this.sensor.width + " , " + this.sensor.height);

//         this.interval = setInterval(() => {
//             context.drawImage(this.viewfinder, 0, 0, this.sensor.width, this.sensor.height);
//             const url = this.sensor.toDataURL("image/png");
//             //this.push(url);
//             console.log("push url ", this.images.length);
//             // this.sensor.toBlob(
//             //     (blob) => this.push(blob), 
//             //     "image/png");

//             // this.images.push({
//             //     url,
//             //     blob
//             // });
//         }, INTERVAL);
//         console.log("The interval: ", INTERVAL);
//     }

//     push = (blob) => {
//         console.log("push url ", this.images.length);
//         this.images.push({
//             blob
//         });
//     }
// }