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
          {props.data.map((data, index) => {
            return (
              <tr key={`${index}`}>
                <td>#{data.empOne}</td>
                <td>#{data.empTwo}</td>

                <td>
                  {data.details.map((project, index) => {
                    return (
                      <li key={`${index}`}>
                        #{project.proj} - {project.days} days
                      </li>
                    );
                  })}
                </td>
                <td>{data.daysWorkedTogether}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataGrid;
