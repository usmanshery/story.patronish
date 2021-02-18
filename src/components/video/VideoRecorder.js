import React, { Component } from 'react';
import Phase, { options } from '../Constants';

import videojs from 'video.js';
import RecordRTC from 'recordrtc';

import 'videojs-record/dist/videojs.record.js';
import '@ffmpeg/ffmpeg/dist/ffmpeg.min.js';
import 'video.js/dist/video-js.css';
import 'videojs-record/dist/css/videojs.record.css';
import './Video.css';

import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
// import FFmpegWasmEngine from 'videojs-record/dist/plugins/videojs.record.ffmpeg-wasm.js';
import 'videojs-record/dist/plugins/videojs.record.ts-ebml.js';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import VJSPlayer from './VideoPlayer';
import GoogleFontLoader from 'react-google-font-loader';
import queryString from 'query-string';

export default class VJSRecorder extends Component{
	
	constructor(props){
		super(props);

		this.state = {
			phase: Phase.start,
			deviceReady: false,
			src: null
		}

		this.requestDevice = this.requestDevice.bind(this);

		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.startPlayback = this.startPlayback.bind(this);
		this.resetRecording = this.resetRecording.bind(this);
		this.playbackFinished = this.playbackFinished.bind(this);

		this.submitRecording = this.submitRecording.bind(this);
		this.onResizeWindow = this.onResizeWindow.bind(this);
		// this.runtestWrapper = this.runtestWrapper.bind(this);
		this.cleanup = this.cleanup.bind(this);
	}
	
	componentDidMount() {
		window.addEventListener("resize", this.onResizeWindow);
		// instantiate Video.js
		var recorder = videojs(this.recorderNode, options, () => {
			// print version information at startup
			const version_info = 'Using video.js ' + videojs.VERSION +
				' with videojs-record ' + videojs.getPluginVersion('record') +
				' and recordrtc ' + RecordRTC.version;
			videojs.log(version_info);
			recorder.record().getDevice();
		});

		// device is ready
		recorder.on('deviceReady', () => {
			console.log('device is ready!');
			this.setState({
				deviceReady: true,
				videoSize: {
					width: this.state.recorder.videoWidth(),
					height: this.state.recorder.videoHeight()
				}
			});
			if(this.state.phase === Phase.null){
				this.setState({
					phase: Phase.start
				});
			}

			let videoWidth = recorder.videoWidth();
			let videoHeight = recorder.videoHeight();
			
			let screenWidth = window.screen.width;
			let screenHeight = window.screen.height;
	
			let videoRatio = videoWidth / videoHeight;
			let screenRatio = screenWidth / screenHeight;
	
			if(videoRatio < screenRatio){
				let factor = screenHeight / videoHeight;
				
				let fillVideoWidth = factor * videoWidth;
				let fillVideoHeight = factor * videoHeight;
		
				factor = screenWidth / fillVideoWidth;
				let finalVideoWidth = screenWidth;
				let finalVideoHeight = fillVideoHeight * factor;
		
				let negTopOffset = (screenHeight - finalVideoHeight) / 2;
		
				let targetDiv = document.getElementById('recorderDiv');
				let tempStr = "width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; top: " + negTopOffset + "px; overflow: hidden;";
				console.log(tempStr);
				targetDiv.style.cssText = tempStr;
		
			}else{
				let factor = screenWidth / videoWidth;
				
				let fillVideoWidth = factor * videoWidth;
				let fillVideoHeight = factor * videoHeight;
		
				factor = screenHeight / fillVideoHeight;
				let finalVideoWidth = fillVideoWidth * factor;
				let finalVideoHeight = screenHeight;
		
				let negLeftOffset = (screenWidth - finalVideoWidth) / 2;
		
				let targetDiv = document.getElementById('recorderDiv');
				let tempStr = "width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; left: " + negLeftOffset + "px;";
				console.log(tempStr);
				targetDiv.style.cssText = tempStr;
			}
			
			// let videoDiv = document.getElementById('videoDiv');
			// videoDiv.classList.add('videoDiv');
		});

		// user clicked the record button and started recording
		recorder.on('startRecord', () => {
			console.log('started recording!');
		});

		// user completed recording and stream is available
		recorder.on('finishRecord', () => {
			// recordedData is a blob object containing the recorded data that
			// can be downloaded by the user, stored on server etc.	
			console.log("finished recording: ", recorder.recordedData);
			
			var recorderElement = document.getElementById('recorder');
			recorderElement.style.display = "none";

			this.setState({
				src: recorder.recordedData
			});
		});

		// error handling
		recorder.on('error', (element, error) => {
			console.warn(error);
		});

		recorder.on('deviceError', () => {
			console.error('device error:', this.recorder.deviceErrorCode);
		});

		this.setState({
			recorder: recorder
		});

		
		// window.setInterval(this.runtestWrapper, 1000 / 60);
	}

	onResizeWindow(){
		if(!this.state.recorder || this.state.phase === Phase.uploading || this.state.phase === Phase.thankyou)
			return;
		let videoWidth = this.state.recorder.videoWidth();
		let videoHeight = this.state.recorder.videoHeight();
		

		let screenWidth = window.screen.width;
		let screenHeight = window.screen.height;

		let videoRatio = videoWidth / videoHeight;
		let screenRatio = screenWidth / screenHeight;

		if(videoRatio < screenRatio){
			let factor = screenHeight / videoHeight;
			
			let fillVideoWidth = factor * videoWidth;
			let fillVideoHeight = factor * videoHeight;
	
			factor = screenWidth / fillVideoWidth;
			let finalVideoWidth = screenWidth;
			let finalVideoHeight = fillVideoHeight * factor;
	
			let negTopOffset = (screenHeight - finalVideoHeight) / 2;
	
			let targetDiv = document.getElementById('recorderDiv');
			let tempStr = "width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; top: " + negTopOffset + "px;";
			console.log(tempStr);
			targetDiv.style.cssText = tempStr;
	
		}else{
			let factor = screenWidth / videoWidth;
			
			let fillVideoWidth = factor * videoWidth;
			let fillVideoHeight = factor * videoHeight;
	
			factor = screenHeight / fillVideoHeight;
			let finalVideoWidth = fillVideoWidth * factor;
			let finalVideoHeight = screenHeight;
	
			let negLeftOffset = (screenWidth - finalVideoWidth) / 2;
	
			let targetDiv = document.getElementById('recorderDiv');
			let tempStr = "width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; left: " + negLeftOffset + "px;";
			console.log(tempStr);
			targetDiv.style.cssText = tempStr;
		}
	}

	// destroy player on unmount
	componentWillUnmount() {
		if (this.state.recorder) {
			this.state.recorder.dispose();
		}
	}

	// recording
	requestDevice(){
		if(!this.state.deviceReady){
			this.setState({
				phase: Phase.null
			});
		}else{
			this.setState({
				phase: Phase.start
			});
		}
	}

	startRecording(){
		if (!this.state.recorder.record().isRecording()) {
			this.state.recorder.record().start();
			let timeMil = Date.now();
			this.setState({
				phase: Phase.recording,
				recStartTimestamp: timeMil
			});
		}
	}

	stopRecording(){
		if (this.state.recorder.record().isRecording()) {
			this.state.recorder.record().stop();
			let timeMil = Date.now();
			this.setState({
				phase: Phase.preview,
				recEndTimestamp: timeMil
			});
		}
		// console.log("Approx recording duration: ", ((this.state.recEndTimestamp - this.state.recStartTimestamp) / 1000));
	}

	startPlayback(){
		// this.setState({
		// 	phase: Phase.playback
		// });
		// var player = videojs('player');
		// player.on('ended', this.playbackFinished);
		// player.play();
	}

	playbackFinished(){
		// console.log("Playback finished. changed state to preview");
		// this.setState({
		// 	phase: Phase.preview
		// });
	}

	resetRecording(){
		var recorder = document.getElementById('recorder');
		recorder.style.display = "block";

		this.setState({
			src: null,
			phase: Phase.start
		});
	}

	submitRecording(){
		// hide everything
		this.setState({
			phase: Phase.uploading
		});
		document.getElementById('recorder').style.display = "none";

		var uploadFile = this.state.src;
		var timestamp = new Date().getTime().toString();
		uploadFile = new File([uploadFile], timestamp);
		
		// query name
		const params = queryString.parse(window.location.search);
		// append video size and duration
		const duration  = Math.floor((this.state.recEndTimestamp - this.state.recStartTimestamp) / 1000);
		const videoResolution = this.state.videoSize;
		
		var fd = new FormData();
		fd.append('upl', uploadFile, 'video.mp4');
		fd.append('ans', JSON.stringify(window.campaign.questions));
		fd.append('url', params.campaign);
		fd.append('dur', duration);
		fd.append('res', JSON.stringify(videoResolution));
		

		let baseUrl;
		if (window.env === "dev") {
			baseUrl = window.devURL + "/uploadVideo";
		}
		else {
			baseUrl = window.prodURL + "/uploadVideo";
		}
		fetch(baseUrl, {
			method: "POST",
			body: fd
		})
		.then(response => response.json())
		.then((json) => {
			if(json.err){
				console.log(json.err);
				return;
			}
			console.log(json.ack);
			this.cleanup();
		}); 
	}

	cleanup(){
		this.state.recorder.dispose();
		this.setState({
			phase: Phase.thankyou
		});
	}

	// ui for dialogues and buttons
	generateCheckDialogue(){
		if(this.state.phase !== Phase.check)
			return (<></>);
		return(
			<div className="dialogue">
				<div className="dialogue_text_box">
					<p>
						Check yourself and start recording when you are ready
					</p>
				</div>
				<button className="button" onClick={this.requestDevice}>
					&#10132;&#8287;&#8287;Next
				</button>
			</div>
		);
	}
	// Record a short video telling us what you like about your new Casper mattress. <span role="img" aria-label="raising hands">🙌🏻</span> Hit record when ready <span role="img" aria-label="point downwards">👇🏻</span>
	generateStartDialogue(){
		if(this.state.phase !== Phase.start)
			return (<></>);
		return(
			<>
				<div className="dialogue">
					<div className="dialogue_text_box">
						<p>
						
						Check yourself and start recording when you are ready
						</p>
					</div>
				</div>
				<button className="buttonRecord buttonMidBottom" onClick={this.startRecording}>
				<span role="img" aria-label="record">&#9898;</span><span role="img" aria-label="space">&#8287;</span><span role="img" aria-label="space">&#8287;</span>RECORD
				</button>
			</>
		);
	}

	generateStopButton(){
		if(this.state.phase !== Phase.recording)
			return (<></>);
		return(
			<>
				<button className="buttonRecord buttonMidBottom" onClick={this.stopRecording}>
				<span role="img" aria-label="stop">&#11036;</span><span role="img" aria-label="space">&#8287;</span><span role="img" aria-label="space">&#8287;</span>STOP
				</button>
			</>
		);
	}

	generatePreviewButtons(){
		if(this.state.phase !== Phase.preview)
			return (<></>);

		return(
			<>
				<div className="uploadControls">
					<button className="buttonRetry" onClick={this.resetRecording}>
						&#8635;&#8287;&#8287;RETRY
					</button>

					<button className="buttonSubmit" onClick={this.submitRecording}>
						<FontAwesomeIcon icon={faCloudUploadAlt}/>&#8287;&#8287;SUBMIT
					</button>
				</div>
			</>
		);
	}

	generateProgressBar(){
		if(this.state.phase !== Phase.uploading)
			return (<></>);
		
		return(
			<div id="uploadProgressDiv">
				<Spinner animation="border" role="status" style={{ width: "100px", height: "100px", border: "0.4em solid currentColor", "borderRightColor": "transparent", "margin-bottom": "50px" }}/>
				<h3 id="progText">uploading</h3>
			</div>
		);
	}

	generateThankyouDialogue(){
		if(this.state.phase !== Phase.thankyou)
			return (<></>);
		return(
			<div className="dialogue">
				<div className="dialogue_text_box">
					<p>
					All done! Thankyou for your response.
					</p>
				</div>
			</div>
		);
	}

	render(){
		
		// const checkDialogue = this.generateCheckDialogue();
		const startDialogue = this.generateStartDialogue();
		const stopButton = this.generateStopButton();
		const previewButtons = this.generatePreviewButtons();
		const progressBar = this.generateProgressBar();
		const thankyouDialogue = this.generateThankyouDialogue();

		return(
			<div id="containerDiv" className="recorderContainer">
				<div className="recorderDiv" id="recorderDiv">
					<GoogleFontLoader fonts={[{font: 'Quicksand',weights: [400]}]} />
					<video id="recorder" ref={node => this.recorderNode = node} className="video-js vjs-default-skin recorder" playsInline></video>
					<VJSPlayer src={this.state.src} phase={this.state.phase}/>
				</div>
				{/* {checkDialogue} */}
				{startDialogue}
				{stopButton}
				{previewButtons}
				{progressBar}
				{thankyouDialogue}
			</div>
		);
	}
}