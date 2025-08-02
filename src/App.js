import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "./App.css";

function App() {
  const [data, setData] = useState([
    {
      user_name: "John Doe",
      role: "Developer",
      salary: 60000,
      status: "Active",
    },
    {
      user_name: "Jane Smith",
      role: "Manager",
      salary: 80000,
      status: "Active",
    },
    {
      user_name: "Bob Johnson",
      role: "Designer",
      salary: 50000,
      status: "Inactive",
    },
  ]);
  const [sortField, setSortField] = useState(null);

  const headerMap = {
    user_name: "Employee Name",
    role: "Role",
    salary: "Salary ($)",
    status: "Status",
  };

  const preprocessData = (data) => {
    return data
      .filter((row) => row.status === "Active") // Remove inactive users
      .map((row) => ({
        "Employee Name": row.user_name,
        Role: row.role,
        "Salary ($)": row.salary,
        Status: row.status,
      }))
      .sort((a, b) => (sortField ? (a[sortField] > b[sortField] ? 1 : -1) : 0));
  };

  const handleExport = () => {
    const processedData = preprocessData(data);
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const timestamp = format(new Date(), "yyyy-MM-dd");
    XLSX.writeFile(wb, `employeesexport_${timestamp}.xlsx`);
    toast.success("Export successful!");
  };

  const handleSort = (field) => {
    setSortField(sortField === field ? null : field);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">HR Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(headerMap).map((key) => (
                  <th
                    key={key}
                    className="p-2 border-b cursor-pointer hover:bg-gray-300"
                    onClick={() => handleSort(headerMap[key])}
                  >
                    {headerMap[key]} {sortField === headerMap[key] ? "↑" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preprocessData(data).map((row, index) => (
                <tr key={index} className="border-b">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="p-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleExport}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default App;
