import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { recordsActions, pageDataActions, RootState, AppDispatch } from "../store";
import { getRecords } from "../utils/api";
import "./scss/records.scss";

function Records() {
  const records = useSelector((state: RootState) => state.records);
  const { curRecord } = useSelector((state: RootState) => state.pageData);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecords();
      dispatch(recordsActions.set(data));
      data.length && dispatch(pageDataActions.setCurRecord(data[0]));
    };

    fetchData();
  }, [dispatch]);

  const genContent = (content: string) => {
    const arr = content.split("\n");
    return arr.map((str, index) => (
      <span key={index}>
        {str}
        <br />
      </span>
    ));
  };

  if (records.length === 0) {
    return (
      <div className="records">
        <div style={{ textAlign: "center" }}>No Records</div>
      </div>
    );
  }

  return (
    <div className="records">
      {records.map(record => (
        <div
          className={`record ${record.id === curRecord.id ? "active" : ""}`}
          key={record.id}
          onClick={() => dispatch(pageDataActions.setCurRecord(record))}
        >
          <div className="record-content">{genContent(record.content)}</div>
          {(record.desc || record.tag?.name) && (
            <div className="record-info">
              <div className="record-desc">{record.desc}</div>
              <div className="record-tag">{record.tag?.name}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Records;
