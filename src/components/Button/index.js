import React from 'react';
import Button from '@material-ui/core/Button';

const CSButton = ({ onclick, color, variant, children, style }) => ( 
	<Button
		style = { style }
		color = {color || 'primary' }
		variant = { variant || 'contained' }
		onClick={ onclick }>
		{ children } 
	</Button>
);

export default CSButton; 