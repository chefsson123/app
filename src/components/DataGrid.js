import "./DataGrid.css";

const DataGrid = (props) => {
 
  return (
    <div className="datagrid-container">
      
      <table>
        <tbody>
          <tr>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Days worked</th>
          </tr>
          <tr>
            <td>{props.employeeStats[0].employeeOne}</td>
            <td>{props.employeeStats[0].employeeTwo}</td>
            <td>{props.employeeStats[0].projectID}</td>
            <td>{props.employeeStats[0].daysWorkedTogether}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
