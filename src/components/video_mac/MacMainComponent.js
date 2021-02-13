import React, { Component } from 'react';

import Welcome from '../welcome/WelcomePage';
import Thankyou from '../thankyou/ThankyouPage';

import Recorder from './RecordView/Recorder';
import ReviewView from './ReviewView/ReviewView';

import Phase from '../Constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../video/Video.css';
import '../video_mac/MacMainComponent.css';

export default class MacMainComponent extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			phase: Phase.welcome,
		}

		this.updatePhase = this.updatePhase.bind(this);
		this.updateRecording = this.updateRecording.bind(this);
		this.updatePhaseCallback = this.updatePhaseCallback.bind(this);
	}

	updatePhaseCallback(){
		this.updatePhase(null);
	}

	updatePhase(phase){
		// console.log("update phase called with: " + phase);

		if(phase){
			this.setState({
				phase: phase
			});
			return;
		}

		switch(this.state.phase){
			case Phase.welcome:
				this.setState({
					phase: Phase.check
				});
			break;
			// only called when submission is done
			case Phase.preview:
				this.setState({
					phase: Phase.thankyou
				});
			break;
				
			default:
				this.setState({
					phase: Phase.welcome
				});
			break;
		}

		// console.log("updated phase now: " + this.state.phase);
	}

	updateRecording(recording){
		this.setState({
			recording: {
				rawData: {
					images: recording.rawData.images,
					playbackInterval: recording.rawData.playbackInterval,
					audioRecorder: recording.rawData.audioRecorder
				},
				recordingDimensions: {
					width: recording.rawData.videoWidth,
					height: recording.rawData.videoHeight
				},
			},
			phase: Phase.preview
		});
	}

	render(){
		const recorderCheck = 
		   this.state.phase === Phase.check 
		|| this.state.phase === Phase.start 
		|| this.state.phase === Phase.recording;

		if(recorderCheck){
			return (
				<div className="main">
					<Recorder onRecordEnd={ this.updateRecording }/>
				</div>
			);
		}

		const playbackCheck = this.state.phase === Phase.preview || this.state.phase === Phase.playback;
		
		if(playbackCheck){
			return (
				<div className="main">
					<ReviewView recording={ this.state.recording } updatePhase={ this.updatePhase }/>
				</div>
			);
		}

		if(this.state.phase === Phase.thankyou){
			return (
				<div className="main">
					<Thankyou/>
				</div>
			);
		}

		// Default:
		return (
			<div className="main">
				<Welcome pahseCallback={this.updatePhaseCallback}/>
			</div>
		);
	}

}