import { connect } from 'react-redux';
import ReviewView from './ReviewView';
import { actions } from '../../../state/recording';

const mapStateToProps = state => ({
    recording: state.recording
});

const mapDispatchToProps = {
    update: actions.update
};

const ReviewViewContainer = connect(mapStateToProps, mapDispatchToProps)(ReviewView);

export default ReviewViewContainer;