import React from 'react';
import {	makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		zIndex: 100
	},
	inner: {
		padding: theme.spacing(3, 4),
		fontSize: 18,
		backgroundColor: theme.palette.primary.light,
		opacity: 0.8
	}
}));

const TextBand = ({ children, position, style }) => {
	const classes = useStyles({
		position
	});
	return ( 
		<div className = { classes.root } style = { style } >
			<div className = { classes.inner }>
				{ children }
			</div>
		</div>
	);
};

export default TextBand;