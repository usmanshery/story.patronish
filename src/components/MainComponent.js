import React, { Component } from 'react';
import './MainComponent.css';

import Welcome from './welcome/WelcomePage';
import VJSRecorder from './video/VideoRecorder';
import Thankyou from'./thankyou/ThankyouPage';

import Phase from './Constants';

class MainComponent extends Component {
	constructor(props){
		super(props);

		this.state = {
			phase: Phase.welcome,
		}
	}


	updatePhase = (args) => {
		let phase = undefined;
		if(args){
			phase = args.phase;
		}
		
		if(phase){
			this.setState({
				phase: phase
			});
			return;
		}

		switch(this.state.phase){
			case Phase.welcome:
				this.setState({
					phase: Phase.start
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
	}

	render(){
		const recorderCheck = this.state.phase === Phase.start 
		|| this.state.phase === Phase.recording 
		|| this.state.phase === Phase.preview 
		|| this.state.phase === Phase.playback;

		if(recorderCheck){
			return (
				<div className="main">
					<VJSRecorder pahseCallback={this.updatePhase}/>
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
				<Welcome pahseCallback={this.updatePhase}/>
			</div>
		);
	}

}

export default MainComponent;
