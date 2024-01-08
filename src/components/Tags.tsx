import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiCancel, mdiViewGrid, mdiPlus, mdiPencil, mdiDeleteForever } from "@mdi/js";
import { useSelector, useDispatch } from "react-redux";
import { tagsActions, recordsActions, pageDataActions, RootState, AppDispatch } from "../store";
import { getTags, getRecords, deleteTag, postTag, updateTag } from "../utils/api";
import "./scss/tags.scss";
import { Button, Input, Modal } from "rsuite";

function Tags() {
  const tags = useSelector((state: RootState) => state.tags);
  const { curTagId } = useSelector((state: RootState) => state.pageData);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(tagsActions.set(await getTags()));
    };

    fetchData();
  }, [dispatch]);

  const liOnClick = async (tag_id: number, force_update = false) => {
    if (tag_id === curTagId && !force_update) return;
    dispatch(pageDataActions.setCurTagId(tag_id));

    if (tag_id === -2) {
      const data = await getRecords();
      dispatch(recordsActions.set(data));
      dispatch(pageDataActions.setCurRecord(data[0] || {}));
    } else if (tag_id === -1) {
      const data = await getRecords({ tag_id: 1 });
      dispatch(recordsActions.set(data));
      dispatch(pageDataActions.setCurRecord(data[0] || {}));
    } else {
      const data = await getRecords({ tag_id });
      dispatch(recordsActions.set(data));
      dispatch(pageDataActions.setCurRecord(data[0] || {}));
    }
  };

  const tagList = tags.map(tag => {
    return (
      <li
        key={tag.id}
        className={tag.id === curTagId ? "active" : ""}
        onClick={() => liOnClick(tag.id)}
      >
        {tag.name}
      </li>
    );
  });

  const [clickable, setClickable] = useState(true);
  const [modalStatus, setModalStatus] = useState(false);
  const [tagName, setTagName] = useState("");

  enum ModalOp {
    ADD,
    EDIT,
    DELETE,
  }

  const [modalOp, setModalOp] = useState(ModalOp.ADD);

  useEffect(() => {
    // -2: All, -1: No Tag
    // when curTagId is -2 or -1, the edit and delete btns are unclickable
    if (curTagId === -2 || curTagId === -1) {
      setClickable(false);
    } else {
      setClickable(true);
    }
    // console.log("curTagId changed", curTagId);
    liOnClick(curTagId, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTagId]);

  const addTagE = () => {
    setModalOp(ModalOp.ADD);
    setModalStatus(true);
    setTagName("");
  };
  const addTagEOk = async () => {
    modalClose();

    const tag = await postTag({ name: tagName });
    dispatch(tagsActions.add(tag));
    dispatch(pageDataActions.setCurTagId(tag.id));
  };

  const editTagE = () => {
    if (!clickable) return;
    setModalOp(ModalOp.EDIT);
    setTagName("");
    setModalStatus(true);
  };
  const editTagEOk = async () => {
    modalClose();

    const tag = await updateTag(curTagId, { name: tagName });
    dispatch(tagsActions.update({ id: curTagId, name: tag.name }));
  };

  const deleteTagE = () => {
    if (!clickable) return;

    setModalOp(ModalOp.DELETE);
    setModalStatus(true);
  };
  const deleteTagEOk = async () => {
    modalClose();
    // 1. delete tag
    // 2. set curTagId to -2
    // 3. fetch records
    dispatch(async (dispatch, getState) => {
      dispatch(tagsActions.delete(curTagId));
      await deleteTag(curTagId);
      dispatch(pageDataActions.setCurTagId(-2));
      dispatch(recordsActions.set(await getRecords()));
      dispatch(pageDataActions.setCurRecord(getState().records[0] || {}));
    });
  };

  const modalClose = () => {
    setModalStatus(false);
  };

  const genModalContent = () => {
    let title = "";
    let content = <p />;
    let onSubmit = () => {};

    switch (modalOp) {
      case ModalOp.ADD:
        title = "Enter the name of the new tag below";
        content = (
          <Input placeholder="Tag name: " value={tagName} onChange={val => setTagName(val)}></Input>
        );
        onSubmit = addTagEOk;
        break;
      case ModalOp.EDIT:
        title = "Enter the new name of the tag below";
        content = (
          <Input
            placeholder="New tag name: "
            onChange={val => setTagName(val)}
            value={tagName}
          ></Input>
        );
        onSubmit = editTagEOk;
        break;
      case ModalOp.DELETE:
        title = "Are you sure to delete the tag below?";
        content = <p>{tags.filter(tag => tag.id == curTagId)?.[0]?.name}</p>;
        onSubmit = deleteTagEOk;
        break;
    }

    return (
      <>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button onClick={onSubmit} appearance="primary">
            Ok
          </Button>
          <Button onClick={modalClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </>
    );
  };

  return (
    <>
      <div className="tag-wrapper">
        <ul className="tags">
          <div className="fixed-tags">
            <li className={curTagId === -2 ? "active" : ""} onClick={() => liOnClick(-2)}>
              <Icon path={mdiViewGrid} size={"16px"} />
              All
            </li>
            <li className={curTagId === -1 ? "active" : ""} onClick={() => liOnClick(-1)}>
              <Icon path={mdiCancel} size={"16px"} rotate={90} />
              No Tag
            </li>
          </div>
          <hr />
          <div className="custom-tags">{tagList}</div>
        </ul>
        <div className="tag-btns">
          <div className="btn" onClick={addTagE}>
            <Icon path={mdiPlus} size={"16px"} />
          </div>
          <div className={`btn ${!clickable ? "unclickable" : ""}`} onClick={editTagE}>
            <Icon path={mdiPencil} size={"16px"} />
          </div>
          <div className={`btn ${!clickable ? "unclickable" : ""}`} onClick={deleteTagE}>
            <Icon path={mdiDeleteForever} size={"16px"} />
          </div>
        </div>
      </div>
      <Modal open={modalStatus} onClose={modalClose} backdrop="static">
        {genModalContent()}
      </Modal>
    </>
  );
}

export default Tags;
