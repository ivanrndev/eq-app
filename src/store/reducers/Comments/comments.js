import {
  ADD_PHOTOS_TO_COMMENT,
  CHANGE_STATUS_LOAD_MORE_COMMENTS,
  CLEAR_COMMENTS,
  DELETE_PHOTOS_FROM_COMMENT,
  GET_COMMENTS,
  GET_COMMENTS_ERROR,
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
      };
    case ADD_PHOTOS_TO_COMMENT:
      return {
        ...state,
        photos: [...state.photos, ...action.payload],
      };
    case DELETE_PHOTOS_FROM_COMMENT:
      const newPhoto = state.photos.filter(
        photo => photo.path !== action.payload,
      );
      return {
        ...state,
        photos: newPhoto,
      };
    default:
      return state;
  }
};

export default commentsReducer;
