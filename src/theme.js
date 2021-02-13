import {
    createMuiTheme
} from '@material-ui/core/styles';

const palette = {
    type: 'dark',
    primary: {
        main: '#666666'
    }
};

const themeName = 'Grayscale';

// A custom theme for this app
const theme = createMuiTheme({
    palette,
    themeName
});

export default theme;