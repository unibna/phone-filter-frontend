import Upload from "antd/es/upload/Upload";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";
import { CsvToHtmlTable } from "react-csv-to-table";
// import UserService from "../services/user.service";

const Home = () => {
  const [csvData, setCsvData] = useState();
  const [fileName, setFileName] = useState();
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      window.location.href = "/login";
    }
    return () => {};
  }, []);

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const fmData = new FormData();
    console.log(fmData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("user"))?.access
        }`,
      },
    };
    fmData.append("file", file);
    console.log('name', file.name) 
    setFileName(file.name.split('.')[0] + '.csv');
    try {
      const res = await axios.post(
        "http://116.118.88.41/api/customer/phones/filters?to_download=true",
        fmData,
        config
      );

      console.log(res);
      onSuccess(setCsvData(res?.data));
    } catch (err) {
      // onError(
      //   setError(
      //     file.type.includes("image")
      //       ? "Vui lòng tải lên định dạng PNG, JPG, HEIC và nhỏ hơn 10MB"
      //       : "Vui lòng tải lên định dạng MP4, MOV  và nhỏ hơn 20MB"
      //   )
      // );
    }
  };

  return (
    <div className="container">
      <header
        className="jumbotron"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#148B6F",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
        >
        {csvData ? <CSVLink data={csvData} filename={fileName}>Download CSV</CSVLink> : null}
        {/* {csvData ? <CSVDownload data={csvData} target="_blank" fileName={fileName}/> : null} */}
        </div>

        <Upload
          customRequest={uploadImage}
          // action={"http://116.118.88.41/api/customer/phones/filters"}
          listType={"picture"}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
          }}
          progress={{ strokeWidth: 2, showInfo: false }}
          style={{ background: "#148B6F" }}
          // onChange={handleFileChange}
        >
          <div>
            <div
              className="flex items-center justify-center gap-4 flex-col"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                fontSize: "20px",
              }}
            >
              <div>
                Drag and drop or{" "}
                <span className=" text-brand_primary">browse</span> to choose a
                file
              </div>
              <div className=" opacity-40">(XLSX, and CSV support)</div>
            </div>
          </div>
        </Upload>
      </header>
      <CsvToHtmlTable
        data={csvData || ""}
        csvDelimiter=";"
        tableClassName="table table-striped table-hover"
      />
    </div>
  );
};

export default Home;
