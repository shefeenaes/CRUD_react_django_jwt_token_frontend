import React from 'react';
import { useTable } from 'react-table';
import axios from 'axios';

const DataTable = ({ data }) => {
  // Define the table columns
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Stock',
        accessor: 'stock',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleUpdate(row)}>Update</button>
            <button onClick={() => handleDelete(row)}>Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  // Create an instance of the table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  // Handle the update action
  const handleUpdate = (row) => {
    // Implement your update logic here
    console.log('Updating row:', row);
  };

  // Handle the delete action
  const handleDelete= async (row) => {
    const id =row.original.id;
    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;

    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/deleteProduct/${id}/`, config);
      console.log('response-->'+response);
    } catch (error) {
      console.error(error);
    }
    console.log('Deleting row:', row);
  };

  return (
    <table {...getTableProps()} style={{ border: '1px solid black' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
