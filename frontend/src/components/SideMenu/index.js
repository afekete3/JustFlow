import SideMenu from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateViewType } from '../../actions/songActions';
import { updateHeaderTitle } from '../../actions/uiActions';

const mapStateToProps = (state) => {

  return {
    title: state.uiReducer.title
  };

};

const mapDispatchToProps = (dispatch) => {

  return bindActionCreators({
    updateViewType,
    updateHeaderTitle,
  }, dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
