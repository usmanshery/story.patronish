import React, { Component } from 'react';
import Phase from '../../Constants';

import '../../video/Video.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import queryString from 'query-string';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
//npm install --save https://github.com/jcblw/image-to-blob
import imageToBlob from 'image-to-blob';
import JSZip from 'jszip';


// import { encode, decode } from "base64-arraybuffer";

export default class ReviewView extends Component {
	playback = React.createRef();
	audioRecorder = null;
	recordingDimensions = null;
	imageBlobArray = [];
	state = {
		status: 'stopped',
		progress: 0,
		phase: Phase.preview,
		temp: 0
	}

	componentDidMount() {
		if (this.props.recording.rawData) {
			this.audioRecorder = this.props.recording.rawData.audioRecorder;
			this.recordingDimensions = this.props.recording.recordingDimensions;
			this.playback.current.width = window.innerWidth;
			this.playback.current.height = window.innerHeight;

			window.addEventListener("resize", this.onResizeWindow);
			this.onResizeWindow();

			this.setupFirstImage();
		} else {
			this.props.updatePhase(Phase.start);
		}
	}

	componentWillUnmount() {
		clearInterval(this.playbackInterval);
	}

	onResizeWindow = () => {
		let targetDiv = document.getElementById('player');
		if (!targetDiv)
			return;

		let videoWidth, videoHeight;
		videoWidth = this.recordingDimensions.width;
		videoHeight = this.recordingDimensions.height;

		let screenWidth = window.screen.width;
		let screenHeight = window.screen.height;

		let videoRatio = videoWidth / videoHeight;
		let screenRatio = screenWidth / screenHeight;

		if (videoRatio < screenRatio) {
			let factor = screenHeight / videoHeight;

			let fillVideoWidth = factor * videoWidth;
			let fillVideoHeight = factor * videoHeight;

			factor = screenWidth / fillVideoWidth;
			let finalVideoWidth = screenWidth;
			let finalVideoHeight = fillVideoHeight * factor;

			let negTopOffset = (screenHeight - finalVideoHeight) / 2;


			let tempStr = "position: absolute; width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; top: " + negTopOffset + "px;";
			// console.log(tempStr);
			targetDiv.style.cssText = tempStr;

		} else {
			let factor = screenWidth / videoWidth;

			let fillVideoWidth = factor * videoWidth;
			let fillVideoHeight = factor * videoHeight;

			factor = screenHeight / fillVideoHeight;
			let finalVideoWidth = fillVideoWidth * factor;
			let finalVideoHeight = screenHeight;

			let negLeftOffset = (screenWidth - finalVideoWidth) / 2;

			let tempStr = "position: absolute; width: " + finalVideoWidth + "px; height: " + finalVideoHeight + "px; left: " + negLeftOffset + "px;";
			// console.log(tempStr);
			targetDiv.style.cssText = tempStr;
		}
	}

	setupFirstImage = () => {
		const img = new Image();
		const firstImage = this.props.recording.rawData.images[0];
		console.log("total imgs recvd: ", this.props.recording.rawData.images.length);
		const context = this.playback.current.getContext('2d');

		img.onload = () => {
			context.drawImage(img, 0, 0);
		}

		img.src = firstImage.url;
	}

	playRecording = () => {
		this.setState({
			status: 'playing'
		});

		const { rawData } = this.props.recording;
		let imageIndex = 0;
		this.playbackInterval = setInterval(() => {
			const context = this.playback.current.getContext('2d');
			const img = new Image();
			const recordedImage = rawData.images[imageIndex];

			img.onload = function () {
				context.drawImage(img, 0, 0);

			}

			img.src = recordedImage.url;

			if (imageIndex >= rawData.images.length - 1) {
				this.stopPlayingRecording();
			}

			imageIndex += 1;
		}, rawData.playbackInterval);
	}

	stopPlayingRecording = () => {
		this.setState({
			status: 'stopped',
			phase: Phase.preview
		}, () => {
			clearInterval(this.playbackInterval)
		});
	}

	handlePlay = () => {
		this.setState({
			phase: Phase.playback
		});
		// console.log("type: " + typeof (this.props.recording.rawData.audioTrack));
		this.audioRecorder.play();
		this.playRecording();
		// this.audio.current.play().then(this.playRecording);
	}

	handleSubmit = () => {
		this.setState({
			phase: Phase.uploading,
		},
			() => this.startSubmission()
		);
	}

	// startSubmission = () => {
	// 	const { images } = this.props.recording.rawData;

	// 	// this.imagesData = images.map((img) => { return img.blob; });
	// 	this.uploadData();
	// }

	startSubmission = () => {
		const { images } = this.props.recording.rawData;
		this.imageBlobArray = [];
		this.convertImagesToBlob(images, 0);
		// window.requestAnimationFrame(this.runtestWrapper);
	}

	convertImagesToBlob = (images, index) => {
		if (index >= images.length) {
			this.uploadData();
			return;
		}
		imageToBlob(images[index].url, (err, blob) => {
			if (err) {
				console.log(err);
				return;
			}
			this.imageBlobArray.push(blob);
			this.convertImagesToBlob(images, index + 1);
			// setTimeout(() => { this.convertImagesToBlob(images, index + 1); }, 3);
		});
	}

	uploadData = () => {
		let baseUrl;
		if (window.env === "dev") {
			baseUrl = window.devURL + "/uploadRawVideo";
		}
		else {
			baseUrl = window.prodURL + "/uploadRawVideo";
		}

		const params = queryString.parse(window.location.search);

		var fd = new FormData();
		fd.append('url', params.campaign);
		fd.append('imgcount', this.imageBlobArray.length);

		var zip = new JSZip();
		this.imageBlobArray.forEach((element, i) => {
			zip.file(`image${i}.png`, this.imageBlobArray[i]);
		});
		zip.file('audio.wav', this.props.recording.rawData.audioRecorder.getWAVBlob());

		zip.generateAsync({ type: "blob" })
			.then((content) => fd.append('data', content, 'data.zip'))
			.then(() => fetch(baseUrl, {method: "POST", body: fd })
			.then(response => response.json())
			.then((json) => {
				console.log(json.ack);
				this.finishUpload();
			}));
	}

	finishUpload = () => {
		this.props.updatePhase(Phase.thankyou);
		// setTimeout(() => {  }, 600);
	}

	resetRecording = () => {
		console.log("reset button called in reviewiew");
		this.props.updatePhase(Phase.start);
	}

	generatePreviewButtons = () => {
		if (this.state.phase !== Phase.preview)
			return (<></>);

		return (
			<>
				<button id="playButton" className="buttonPlay" onClick={this.handlePlay}>
				</button>

				<div className="uploadControls">

					<button className="buttonRetry" onClick={this.resetRecording}>
						&#8635;&#8287;&#8287;RETRY
					</button>

					<button className="buttonSubmit" onClick={this.handleSubmit}>
						<FontAwesomeIcon icon={faCloudUploadAlt} />&#8287;&#8287;SUBMIT
					</button>
				</div>
			</>
		);
	}

	generateProgressBar = () => {
		if (this.state.phase !== Phase.uploading)
			return (<></>);

		return (
			<div id="uploadProgressDiv">
				<Spinner animation="border" role="status" style={{ width: "100px", height: "100px", border: "0.4em solid currentColor", "borderRightColor": "transparent", "marginBottom": "50px" }} />
				<h3 id="progText">uploading</h3>
			</div>
		);
	}

	render() {

		const previewButtons = this.generatePreviewButtons();
		const progressBar = this.generateProgressBar();

		return (
			<div className='review-view'>
				{ this.state.phase !== Phase.uploading ? <canvas id='player' ref={this.playback} /> : <></>}
				{ this.state.phase !== Phase.uploading ? <audio ref={this.audio} style={{ display: 'none' }} controls /> : <></>}
				{ previewButtons}
				{ progressBar}
			</div>
		);
	}
}