import "./scss/recordModal.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, pageDataActions, recordsActions } from "../store";
import { updateRecord, postRecord } from "../utils/api";
import { Button, Drawer, Input, SelectPicker } from "rsuite";

function RecordModal() {
  const { modalVisible, recordData, isNewRecord, curRecord, curTagId } = useSelector(
    (state: RootState) => state.pageData
  );
  const tags = useSelector((state: RootState) => state.tags);
  const dispatch: AppDispatch = useDispatch();

  const handleClose = () => {
    dispatch(pageDataActions.setModalVisible(false));
  };

  const handleSave = async () => {
    // if (recordData.content.trim() === "")
    //   return alert("Content cannot be empty. Please enter some content.");

    if (isNewRecord) {
      const data = await postRecord(recordData);
      dispatch(recordsActions.add(data));
      dispatch(pageDataActions.setCurRecord(data));
    } else {
      const data = await updateRecord(curRecord.id, recordData);
      dispatch(recordsActions.update(data));
      dispatch(pageDataActions.setCurRecord(data));
    }
    handleClose();
  };

  const handleDescChange = (val: string) => {
    dispatch(pageDataActions.setRecordData({ ...recordData, desc: val }));
  };

  const handleContentChange = (val: string) => {
    dispatch(pageDataActions.setRecordData({ ...recordData, content: val }));
  };

  const handleTagIdChange = (val: string | null) => {
    dispatch(pageDataActions.setRecordData({ ...recordData, tag_id: parseInt(val || "1") }));
  };

  return (
    <Drawer
      placement={"bottom"}
      open={modalVisible}
      onClose={handleClose}
      size={480}
      className="recordDrawer"
      keyboard={false}
    >
      <div className={"modal"}>
        <div className="select">
          <SelectPicker
            label="Tag"
            data={tags}
            labelKey="name"
            valueKey="id"
            className="tag-selector"
            block
            size="lg"
            onChange={handleTagIdChange}
            // @ts-expect-error valueKey is number
            defaultValue={curTagId}
          />
        </div>
        <div className="content">
          <Input
            autoFocus
            as="textarea"
            value={recordData.content}
            placeholder="Content"
            onChange={handleContentChange}
            size="lg"
          />
        </div>
        <div className="desc">
          <Input
            placeholder="Description"
            value={recordData.desc!}
            onChange={handleDescChange}
            size="lg"
          />
        </div>
        <div className="btns">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} appearance="primary">
            Confirm
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

export default RecordModal;
