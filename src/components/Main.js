import "./Main.css";
import React, { useState } from "react";
import Label from "./Label";
import DataGrid from "./DataGrid";

const Main = () => {
  /*             Start Uploading          */
  const [fileResult, setFileResult] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  var today = new Date();

  function onStartUpload(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      /* split employees by row  */
      const splitEmployees = e.target.result.trim().split("\r\n");
      const employeesDate = splitEmployees.map((employee) => {
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

      const oneDay = 24 * 60 * 60 * 1000, // hours*minutes*seconds*milliseconds
        setDate = (YMD) => {
          let [Y, M, D] = YMD.split("-").map(Number);
          return new Date(Y, --M, D);
        };

      /*group Employees by project id , change date string to JS newDate */

      const employees = employeesDate.reduce(
        (r, [EmployeeID, ProjectID, StartDate, EndDate]) => {
          let startD = setDate(StartDate),
            endD = EndDate ? setDate(EndDate) : new Date();
          r[ProjectID] = r[ProjectID] ?? [];
          r[ProjectID].push({ EmployeeID, startD, endD });
          return r;
        },
        {}
      );

      let combination = {};
      for (let proj in employees)
        for (let i = 0; i < employees[proj].length - 1; i++)
          for (let j = i + 1; j < employees[proj].length; j++) {
            let empOne = employees[proj][i];
            let empTwo = employees[proj][j];

            if (
              (empOne.endD <= empTwo.endD && empOne.endD > empTwo.startD) ||
              (empTwo.endD <= empOne.endD && empTwo.endD > empOne.startD)
            ) {
              let D1 =
                  empOne.startD > empTwo.startD ? empOne.startD : empTwo.startD,
                D2 = empOne.endD < empTwo.endD ? empOne.endD : empTwo.endD,
                days = Math.ceil((D2 - D1) / oneDay),
                key = `${empOne.EmployeeID}-${empTwo.EmployeeID}`;
              combination[key] = combination[key] ?? {
                empOne: empOne.EmployeeID,
                empTwo: empTwo.EmployeeID,
                daysWorkedTogether: 0,
                details: [],
              };
              combination[key].details.push({ proj: Number(proj), days });
              combination[key].daysWorkedTogether += days;
            }
          }

      let result = Object.entries(combination)
        .sort((a, b) => b[1].daysWorkedTogether - a[1].daysWorkedTogether)
        .map(([k, v]) => v);
      result.length = 1;
      setFileResult(result);

      console.log(JSON.stringify(result).replaceAll('"', ""));
    };

    reader.readAsText(file);
  }

  return (
    <div className="content">
      <Label />
      <input type="file" id="fileInput" onChange={onStartUpload} />
      {fileResult && <DataGrid data={fileResult} />}
    </div>
  );
};

export default Main;
