import { useState } from "react";
import DataGrid from "./DataGrid";
import "./Input.css";

const Input = () => {
  const [fileResult, setFileResult] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  var today = new Date();

  /*             Start Uploading          */
  function onStartUpload(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      /* split employees by row  */
      const splitEmployees = e.target.result.trim().split("\r\n");
      const employeesData = splitEmployees.map((employee) => {
        /* in case of NULL - get current date */
        return employee
          .replaceAll(
            "NULL",
            today.getFullYear() +
              "-" +
              (today.getMonth() + 1) +
              "-" +
              today.getDate()
          )
          .split(",");
      });

      employeesData.map((workDate) => {
        /*  Format Employee Working Day Start and End to a universal type for different dates.
  Then get the reformatted date */
        workDate[2] = new Date(workDate[2])
          .toISOString()
          .substring(0, 10)
          .replaceAll("-", ", ");
        workDate[3] = new Date(workDate[3])
          .toISOString()
          .substring(0, 10)
          .replaceAll("-", ", ");
        return workDate;
      }); /* Store each employee ID, Project working on and summarized work days so far in an object */
      const employeeStats = employeesData.map((data) => {
        return {
          employeeID: data[0].trim(),
          projectID: data[1].trim(),
          daysWorked: Math.round(
            Math.abs((new Date(data[2]) - new Date(data[3])) / oneDay)
          ) /*Create new dates for employee - new Date(2005, 01, 01) */,
        };
      });

      employeeStats.sort(function (a, b) {
        return b.daysWorked - a.daysWorked; /* Sort employee by worked days */
      });

      var sortedByDays = employeeStats.reduce(function (r, a) {
        /* Group employees working on the same project in different arrays */ r[
          a.projectID
        ] = r[a.projectID] || [];
        r[a.projectID].push(a);

        return r;
      }, []);

      employeeStats.sort(function (a, b) {
        /*Group array by project ID */ return b.projectID - a.projectID;
      });

      var summarizeDaysWorked = sortedByDays.map((item) => {
        /* Add days worked for the employees with most worked days on this project */
        return {
          employeeOne: item[0].employeeID,
          employeeTwo: item[1].employeeID,
          daysWorkedTogether: item[0].daysWorked + item[1].daysWorked,
          projectID: item[0].projectID,
        };
      });

      summarizeDaysWorked.sort(function (a, b) {
        /* Sort array to get the project that was most worked on */ return (
          b.daysWorkedTogether - a.daysWorkedTogether
        );
      });

      for (let i = 0; i < summarizeDaysWorked.length + 1; i++) {
        /* Leave only most worked on project employees */
        summarizeDaysWorked.pop();
      }

      setFileResult(summarizeDaysWorked);
      setIsFileUploaded(true);
      JSON.stringify(summarizeDaysWorked);
      console.log(
        "Employee #" +
          summarizeDaysWorked[0].employeeOne +
          " and Employee #" +
          summarizeDaysWorked[0].employeeTwo +
          " have worked on project #" +
          summarizeDaysWorked[0].projectID +
          " for the highest number of days ( " +
          summarizeDaysWorked[0].daysWorkedTogether +
          " )"
      );
    };
    reader.readAsText(file);
  }

  return (
    <div className="input-container">
      <div className="label-container">
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload your file here
        </label>
      </div>
      <input type="file" id="fileInput" onChange={onStartUpload} />
      {isFileUploaded && <DataGrid employeeStats={fileResult} />}
    </div>
  );
};

export default Input;
