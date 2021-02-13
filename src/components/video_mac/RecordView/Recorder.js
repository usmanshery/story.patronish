import React, { Component } from 'react';
import Capture from '../../../lib/capture';
import '../../video/Video.css';
import Phase from '../../Constants';

class Recorder extends Component {
	constructor(props){
		super(props);
		let phase = Phase.check;
		if(props.phase)
		phase = props.phase;
		this.viewfinder = React.createRef();
		this.state = {
			phase: phase,
			deviceReady: false
			// audio: audioTrack
		};
	}

	componentDidMount() {
		this.capture = new Capture(this.viewfinder.current,
			() => {
				this.onResizeWindow();
				this.setState({
					deviceReady: true
				});
				if(this.state.phase === Phase.null){
					console.log('start phase set');
					this.setState({
						phase: Phase.start
					});
				}
			});

		this.setState({
			phase: Phase.check
		});

		this.onResizeWindow = this.onResizeWindow.bind(this);
		window.addEventListener("resize", this.onResizeWindow);

		// console.log("Recorder.js | possible issue code ahead");
		// if (navigator.mediaDevices.getUserMedia) {
		// 	navigator.mediaDevices.getUserMedia({
		// 		audio: true,
		// 		video: { facingMode: { ideal: 'environment' } } // prefer rear-facing camera
		// 	}).then((stream) => {
		// 		console.log("Recorder.js | possible issue code 1");
		// 		console.log('stream loaded');
		// 		this.onResizeWindow();
		// 		this.setState({
		// 			deviceReady: true
		// 		});
		// 		if(this.state.phase === Phase.null){
		// 			console.log('start phase set');
		// 			this.setState({
		// 				phase: Phase.start
		// 			});
		// 		}
		// 	}, (err) => { console.log(err); });
		// }
	}

	onResizeWindow(){
		let stream = this.viewfinder.current;
		if(stream == null)
			return;
		
		let videoWidth, videoHeight;
		videoWidth = stream.videoWidth;
		videoHeight = stream.videoHeight;

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
			// console.log(tempStr);
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
			// console.log(tempStr);
			targetDiv.style.cssText = tempStr;
		}
	}

	requestDevice = () => {
		if(this.state.deviceReady)
			this.setState({
				phase: Phase.start
			});
		else
			this.setState({
				phase: Phase.null
			});
	}

	startRecording = () => {
		this.setState({
			status: 'recording',
			phase: Phase.recording
		}, this.capture.startRecording);
	}

	stopRecording = () => {
		this.capture.stopRecording().then(this.props.onRecordEnd);
		// this.setState({
		// 	status: 'processing'
		// }, () => {
		// 	this.capture.stopRecording().then(this.props.onRecordEnd);
		// })
	}

	handleStatusUpdate(status) {
		this.setState({
				status
		});
	}

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

	generateStartDialogue(){
		if(this.state.phase !== Phase.start)
			return (<></>);
		return(
			<>
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

	render() {
		const checkDialogue = this.generateCheckDialogue();
		const startDialogue = this.generateStartDialogue();
		const stopButton = this.generateStopButton();

		return ( 
			<div id="containerDiv" className="recorderContainer">
				<div id="recorderDiv" className='recorderDiv'>
					<video id="recorder" className='recorderDiv recorder'
					 width={window.innerWidth} height={window.innerHeight} muted autoPlay playsInline ref = { this.viewfinder }/>
				</div>
				
				{ checkDialogue }
				{ startDialogue }
				{ stopButton }
			</div>
		);
	}

}

export default Recorder;