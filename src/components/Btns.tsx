import Icon from "@mdi/react";
import {
  mdiContentCopy,
  mdiSend,
  mdiPlus,
  mdiPencil,
  mdiDeleteForever,
  mdiCheckAll,
  mdiCog,
} from "@mdi/js";
import { useSelector, useDispatch } from "react-redux";
import "./scss/btns.scss";
import {
  RootState,
  recordsActions,
  pageDataActions,
  AppDispatch,
  notificationActions,
} from "../store";
import { deleteRecord } from "../utils/api";
import { Drawer, Input, Modal, Button } from "rsuite";
import { useState } from "react";

interface IBtnsProps {
  icon: string;
  className?: string;
  onClick?: () => void;
}

function BtnBot() {
  const { curRecord, modalVisible, API_BASE_URL } = useSelector(
    (state: RootState) => state.pageData
  );
  const dispatch: AppDispatch = useDispatch();
  const size = "22px";
  const className = "accent";
  const topIconsInfo: IBtnsProps[] = [
    {
      icon: mdiSend,
      className,
      onClick: () => {
        if ("utools" in window) {
          // @ts-expect-error api available when running in utools
          window.utools.hideMainWindowPasteText(curRecord.content);
        } else {
          dispatch(
            notificationActions.push({ message: "This only works under Utools", type: "warning" })
          );
        }
      },
    },
    {
      icon: mdiContentCopy,
      onClick: () => {
        dispatch(notificationActions.push({ message: "Copied to clipboard." }));
        navigator.clipboard.writeText(curRecord.content);
      },
    },
  ];
  const botIconsInfo: IBtnsProps[] = [
    {
      icon: mdiPlus,
      className,
      onClick: () => {
        dispatch(pageDataActions.setModalVisible(!modalVisible));
        dispatch(pageDataActions.setIsNewRecord(true));
      },
    },
    {
      icon: mdiPencil,
      onClick: () => {
        if (curRecord.id === undefined) return;
        const { tag_id, content, desc } = curRecord;
        dispatch(pageDataActions.setModalVisible(!modalVisible));
        dispatch(pageDataActions.setRecordData({ tag_id, content, desc }));
        dispatch(pageDataActions.setIsNewRecord(false));
      },
    },
    {
      icon: mdiDeleteForever,
      onClick: async () => {
        if (curRecord.id === undefined) return;
        modalOpen();
      },
    },
    {
      icon: mdiCheckAll,
      onClick: () => {
        dispatch(notificationActions.push({ message: "Not implemented yet...", type: "warning" }));
      },
    },
    {
      icon: mdiCog,
      onClick: () => {
        setDrawerOpen(true);
      },
    },
  ];

  const genBtns = (iconsInfo: IBtnsProps[]) => {
    return iconsInfo.map(iconInfo => {
      return (
        <div
          className={`btns ${iconInfo?.className || ""}`}
          key={iconInfo.icon}
          onClick={iconInfo.onClick}
        >
          <Icon path={iconInfo.icon} size={size} />
        </div>
      );
    });
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const modalOpen = () => setDeleteModalOpen(true);
  const modalClose = () => setDeleteModalOpen(false);
  return (
    <div className="btnGroups">
      <div className="topBtns">{genBtns(topIconsInfo)}</div>
      <div className="botBtns">{genBtns(botIconsInfo)}</div>
      <Modal open={deleteModalOpen} onClose={modalClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Are you sure to delete this record?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{curRecord.content?.slice(0, 100)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={async () => {
              dispatch((dispatch, getState) => {
                dispatch(recordsActions.delete(curRecord.id));
                dispatch(pageDataActions.setCurRecord(getState().records[0] || {}));
              });
              modalClose();

              await deleteRecord(curRecord.id);
            }}
            appearance="primary"
          >
            Ok
          </Button>
          <Button onClick={modalClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} backdrop="static">
        <Drawer.Header>
          <Drawer.Title>Setting</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <label>API BASE URL: (after change, reenter the app)</label>
          <Input
            value={API_BASE_URL}
            placeholder="e.g. http://localhost:8000"
            onChange={val => {
              dispatch(pageDataActions.setAPI_BASE(val));
            }}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

export default BtnBot;
