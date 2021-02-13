import React, { Component } from 'react';
import VideoPlayer from 'react-video-js-player';
import './Video.css';
import Phase from '../Constants';

class VJSPlayer extends Component {
	constructor(props){
		super(props);
		this.startPlayback = this.startPlayback.bind(this);
	}

	player = {}

	onPlayerReady(player){
		console.log("Player is ready: ", player);
		this.player = player;
	}

	onVideoPlay(duration){
		console.log("Video played at: ", duration);
	}

	onVideoEnd(){
		var playButton = document.getElementById('playButton');
		playButton.style.display = "block";
	}

	startPlayback(){
		var playButton = document.getElementById('playButton');
		playButton.style.display = "none";
		this.player.play();
	}

	render() {
		if(this.props.src == null || this.props.phase === Phase.uploading || this.props.phase === Phase.thankyou)
			return (<></>);
		return (
			<>
				<button id="playButton" className="buttonPlay" onClick={this.startPlayback}></button>
				<div className="player">
					<VideoPlayer
						className="player"
						controls={false}
						src={{src: window.URL.createObjectURL(this.props.src),type: 'video/mp4'}}
						onReady={this.onPlayerReady.bind(this)}
						onPlay={this.onVideoPlay.bind(this)}
						onEnd={this.onVideoEnd.bind(this)}
						/>

				</div>
			</>
		);
	}
}
export default VJSPlayer;