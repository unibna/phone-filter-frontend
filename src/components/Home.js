import Upload from "antd/es/upload/Upload";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";
import { CsvToHtmlTable } from "react-csv-to-table";
// import UserService from "../services/user.service";

const Home = () => {
  // const [content, setContent] = useState("");
  const [csvData, setCsvData] = useState();
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      window.location.href = "/login";
    }
    return () => {};
  }, []);

  // useEffect(() => {
  //   UserService.getPublicContent().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response && error.response.data) ||
  //         error.message ||
  //         error.toString();

  //       setContent(_content);
  //     }
  //   );
  // }, []);

  // const csvmaker = function (data) {
  //   let csvRows = [];
  //   const headers = Object.keys(data[0]);
  //   csvRows.push(headers.join(","));
  //   for (const row of data) {
  //     const values = headers.map((e) => {
  //       return row[e];
  //     });
  //     csvRows.push(values.join(","));
  //   }
  //   return csvRows.join("\n");
  // };

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
  console.log("csvData", csvData);

  return (
    <div className="container">
      <header
        className="jumbotron"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
          }}
        >
          <CSVLink data={csvData || []}>Download CSV</CSVLink>
        </div>
        <CSVDownload data={csvData || []} target="_blank" />

        <Upload
          customRequest={uploadImage}
          // action={"http://116.118.88.41/api/customer/phones/filters"}
          listType={"picture"}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: true,
          }}
          progress={{ strokeWidth: 2, showInfo: false }}
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
