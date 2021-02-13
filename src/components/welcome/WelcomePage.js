import React, { Component } from 'react';
import { checkmark } from '../Constants';
import './WelcomePage.css';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';

class Welcome extends Component {

	constructor(props) {
		super(props);

		this.state = {
			questionNo: -1
		};

		this.renderQuestion = this.renderQuestion.bind(this);
		this.handleNext = this.handleNext.bind(this);

		this.resetOptions = this.resetOptions.bind(this);
		this.markOption = this.markOption.bind(this);
	}

	handleNext() {
		let questionNo = this.state.questionNo;
		questionNo++;

		// there are questions and this one is first one (answered) or ahead
		if(window.campaign.questions.length > 0 && questionNo > 0){
			// save answe to array
			window.campaign.questions[questionNo - 1]["answers"] = this.state.checked;
		}

		if (window.campaign.questions.length === questionNo) {
			this.props.pahseCallback();
			return;
		}

		let count = window.campaign.questions[questionNo].options.length;
		this.setState({
			questionNo,
			checked: Array(count).fill(false)
		});
	}

	resetOptions() {
		this.setState({
			checked: this.state.checked.fill(false)
		});
	}

	markOption(index, value = undefined) {
		let checked = this.state.checked;
		checked[index] = value !== undefined ? value : true;
		this.setState({
			checked
		});
	}

	renderQuestion() {
		if (this.state.questionNo < 0) {
			return undefined;
		}
		// get question object
		let question = window.campaign.questions[this.state.questionNo];

		// generate based on type
		// question text:

		// options:
		let options = question.options.map(
			(value, index) => {
				let control;
				if (question.type === "or") {
					// single-choice: radio button
					control = <FormControlLabel
						key={index}
						control={<Radio
							checked={this.state.checked[index]}
							onChange={() => {
								this.resetOptions();
								this.markOption(index);
							}}
						/>}
						label={value} />;
				} else {
					// multiple-choice: checkbox
					control = <FormControlLabel
						key={index}
						control={<Checkbox
							checked={this.state.checked[index]}
							onChange={(event) => { this.markOption(index, event.target.checked); }}
						/>}
						label={value} />;
				}
				return control;
			}
		);

		if (question.type === "and") {
			question = <><p>{question.statement}</p><div className="checkboxGroup">{options}</div></>;
		} else {
			question = <><p>{question.statement}</p><RadioGroup>{options}</RadioGroup></>;
		}

		return question;
	}

	render() {
		let question = this.renderQuestion();

		return (
			<div className="dialogue">
				<div className="dialogue_text_box">
					{
						question === undefined ? <p>{window.campaign.intro}</p> : question
					}
				</div>
				<button className="button" onClick={this.handleNext}>
					{checkmark}&#8287;&#8287;&#8287;YES
				</button>
			</div>
		);
	}
}

export default Welcome;