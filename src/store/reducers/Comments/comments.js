import {
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  CHANGE_STATUS_LOAD_MORE_COMMENTS,
  CLEAR_COMMENTS,
  SEND_COMMENT,
  SEND_COMMENT_ERROR,
} from '../../../actions/actionsType.js';

const initialState = {
  commentsList: [],
  commentsloadMore: false,
  offSet: 0,
  isInfoOpen: false,
  commentsError: false,
  itemId: '',
  addNewComment: false,
  addNewCommentError: '',
  page: '',
};

const commentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_COMMENTS:
      return {
        ...state,
        ...action.payload,
      };
    case SEND_COMMENT:
      return {
        ...state,
        ...action.payload,
      };
    case SEND_COMMENT_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COMMENTS_ERROR:
      return {
        ...state,
        ...action.payload,
      };
    case CHANGE_STATUS_LOAD_MORE_COMMENTS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_COMMENTS:
      return {
        ...state,
        ...action.payload,
        // commentsList: state.commentsList.concat(action.payload.commentsList),
        // offSet: state.offSet + action.payload.offSet,
      };
    default:
      return state;
  }
};

export default commentsReducer;
