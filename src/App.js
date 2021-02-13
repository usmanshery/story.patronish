import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import MacMainComponent from './components/video_mac/MacMainComponent';

import platform from 'platform';
import MainComponent from './components/MainComponent';

import Spinner from 'react-bootstrap/Spinner';
import queryString from 'query-string';

export default class App extends Component {
	constructor(props){
		super(props);

		this.state = {
			validating: true,
			valid: false
		}

		this.validationCB = this.validationCB.bind(this);
	}

	componentDidMount(){
		// start url validation
		const params = queryString.parse(window.location.search);
		if(!params.campaign){
			this.setState({
				validating: false,
				valid: false,
				msg: "Invalid Campaign URL"
			});
			return;
		}
		
		let baseUrl;
		if (window.env === "dev") {
			baseUrl = window.devURL + "/campaign/";
			console.log("developmental build ");
		}
		else {
			baseUrl = window.prodURL + "/campaign/";
		}
		
		const url = baseUrl + params.campaign;
		fetch(url, { method: "GET" })
		.then(response => response.json())
		.then(this.validationCB); 
	}

	validationCB(json){
		if(!json.success){
			this.setState({
				validating: false,
				valid: false,
				msg: json.msg
			});
		}else{
			window.campaign = json.campaign;
			this.setState({
				validating: false,
				valid: true
			});
		}
	}

	render() {
		if(this.state.validating){
			return (
				<div className="loading">
					<Spinner animation="border" role="status" style={{ width: "100px", height: "100px", border: "0.4em solid currentColor", "borderRightColor": "transparent"}}/>
				</div>
			);
		}
		// if url was found to be invalid, show error screen
		if(!this.state.valid){
			return (
				<div className="loading-failed">
					<h1>{this.state.msg}</h1>
				</div>
			);
		}

		return <BrowserRouter>
			{
				platform.name === 'Safari' ?
					<Route path='/' component={MacMainComponent} /> :
					<Route path='/' component={MainComponent} />
			}
			{() => console.log("platform " + platform.name)}
		</BrowserRouter>
	}
};