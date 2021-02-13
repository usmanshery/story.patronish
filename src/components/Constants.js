const Phase = {
	welcome: "welcome",
	check: "check",
	question: "question",
	start: "start",
	recording: "recording",
	preview: "preview",
	playback: "playback",
	uploading: "uploading",
	thankyou: "thankyou",
	test: "test",
	null: "null"
}

const checkmark = '✔';

const options = {
	controls: false,
	fluid: false,
	fill: true,
	plugins: {
		record: {
			audio: true,
			video: true,
			maxLength: 120,
			debug: true
		}
	}
};

const archiveOptions = {
	name: 'Node Archiving Sample App',
	hasAudio: true,
	hasVideo: true,
	outputMode: "individual",
	layout: {
		type: "bestFit"
	}
};
export {
	checkmark, 
	options, 
	archiveOptions
}
export default Phase;