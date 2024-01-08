import "rsuite/dist/rsuite-no-reset.min.css";
import "./App.scss";
import Btns from "./components/Btns";
import RecordModal from "./components/RecordModal";
import Records from "./components/Records";
import Tags from "./components/Tags";
import { AppDispatch, RootState, notificationActions } from "./store";
import { useSelector, useDispatch } from "react-redux";
import { Message, useToaster } from "rsuite";
import { useEffect } from "react";
import { serviceAxios } from "./utils/api";

function Main() {
  const toaster = useToaster();
  const dispatch: AppDispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    // global notification handler
    const notification = notifications[0];
    if (!notification) return;

    const message = (
      <Message showIcon type={notification.type ? notification.type : "info"} closable>
        <p>{notification.message}</p>
      </Message>
    );
    // bug: message push will be ignored if they are consecutive
    toaster.push(message, {
      placement: "topCenter",
      duration: notification.duration ? notification.duration : 1000,
    });

    dispatch(notificationActions.pop());
  }, [notifications, dispatch, toaster]);

  useEffect(() => {
    // since redux store's dispatch can only be called in react components,
    // we have to use axios's interceptors to handle global error notification here

    // request interceptor
    serviceAxios.interceptors.request.use();

    // response interceptor
    serviceAxios.interceptors.response.clear();
    serviceAxios.interceptors.response.use(
      response => {
        response.data = response.data.data;
        return response;
      },
      error => {
        dispatch(
          notificationActions.push({
            type: "error",
            message: error.response?.data?.msg || error.message,
            duration: 3000,
          })
        );
        console.error("err: " + error.response?.data?.msg); // for debug
        return Promise.reject(error);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="main">
        <aside className="left">
          <Tags />
        </aside>
        <main className="middle">
          <Records />
        </main>
        <aside className="right">
          <Btns />
        </aside>
        <RecordModal />
      </div>
    </>
  );
}

export default Main;
