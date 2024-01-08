// store.ts
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { IRecordGet, IRecordPost, ITagGet, Notification } from "./utils/interfaces";

const recordsSlice = createSlice({
  name: "records",
  initialState: [] as IRecordGet[],
  reducers: {
    set(_, action) {
      return action.payload;
    },
    delete(state, action) {
      return state.filter(record => record.id !== action.payload);
    },
    update(state, action) {
      const record = action.payload;
      return state.map(item => (item.id === record.id ? record : item));
    },
    add(state, action) {
      return [action.payload, ...state];
    },
  },
});

const tagsSlice = createSlice({
  name: "tags",
  initialState: [] as ITagGet[],
  reducers: {
    set(_, action) {
      return action.payload;
    },
    delete(state, action) {
      return state.filter(tag => tag.id !== action.payload);
    },
    update(state, action) {
      const tag = action.payload;
      return state.map(item => (item.id === tag.id ? tag : item));
    },
    add(state, action) {
      return [action.payload, ...state];
    },
  },
});

const pageDataSlice = createSlice({
  name: "pageData",
  initialState: {
    curTagId: -2,
    curRecord: {} as IRecordGet,
    modalVisible: false,
    recordData: {
      tag_id: 1,
      desc: "",
      content: "",
    } as IRecordPost,
    isNewRecord: true,
    API_BASE_URL: localStorage.getItem("API_BASE_URL") || "",
  },
  reducers: {
    setCurTagId(state, action) {
      state.curTagId = action.payload;
    },
    setCurRecord(state, action) {
      state.curRecord = action.payload;
    },
    setModalVisible(state, action) {
      state.modalVisible = action.payload;
    },
    setRecordData(state, action) {
      state.recordData = action.payload;
    },
    setIsNewRecord(state, action) {
      if (action.payload === true)
        state.recordData = {
          tag_id: state.curTagId > 1 ? state.curTagId : 1,
          desc: "",
          content: "",
        };

      state.isNewRecord = action.payload;
    },
    setAPI_BASE(state, action) {
      state.API_BASE_URL = action.payload;
      localStorage.setItem("API_BASE_URL", action.payload);
    },
  },
});

const notificationSlice = createSlice({
  name: "notification",
  initialState: [] as Notification[],
  reducers: {
    push(state, action: { payload: Notification; type: string }) {
      return [action.payload, ...state];
    },
    pop(state) {
      return state.slice(1);
    },
  },
});

// export actions
export const recordsActions = recordsSlice.actions;
export const tagsActions = tagsSlice.actions;
export const pageDataActions = pageDataSlice.actions;
export const notificationActions = notificationSlice.actions;

const store = configureStore({
  reducer: {
    records: recordsSlice.reducer,
    tags: tagsSlice.reducer,
    pageData: pageDataSlice.reducer,
    notification: notificationSlice.reducer,
  },
  // middleware: getDefaultMiddleware => getDefaultMiddleware(),
  devTools: true,
});

// export type of store, this is very useful for dispatch actions and select state in app
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
