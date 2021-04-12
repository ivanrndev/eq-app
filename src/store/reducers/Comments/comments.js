import {
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
  CHANGE_STATUS_LOAD_MORE_COMMENTS,
  CLEAR_COMMENTS,
  SEND_COMMENT,
  SEND_COMMENT_ERROR,
  ADD_PHOTOS_TO_COMMENT,
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
  photos: [],
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
    case ADD_PHOTOS_TO_COMMENT:
      return {
        ...state,
        photos: [...state.photos, ...action.payload],
      };
    default:
      return state;
  }
};

export default commentsReducer;
