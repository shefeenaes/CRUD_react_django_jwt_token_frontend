import React from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useState } from 'react';
import './DataTable.css'; // Import custom CSS file
import UpdateProduct from './UpdateProduct';

const DataTable = ({ data },) => {
  // Define the table columns
  
  const [isUpdate, setUpdateComponent] = useState(false);
  const [Id, setId] = useState();
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
            <button onClick={() => handleUpdate(row)} className="action-button update-button">
              Update
            </button>
            <button onClick={() => handleDelete(row)} className="action-button delete-button">
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Create an instance of the table with pagination and sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page index and page size
    },
    useSortBy, // Enable sorting
    usePagination // Enable pagination
  );

  // Handle the update action
  const handleUpdate = (row) => {
    
    setId(row.original.id);
    setUpdateComponent(true)
    console.log('Updating row:', row);
  };

  // Handle the delete action
  const handleDelete = async (row) => {
    const id = row.original.id;
    const storedAccessToken = localStorage.getItem('accessToken');
    const accessToken = storedAccessToken;
    const config = {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/deleteProduct/${id}/`, config);
      console.log('response-->' + response);
      toast.success('Row deleted successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error('an unexpected error occured', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    console.log('Deleting row:', row);
  };
if(!isUpdate){
  return (
    <div className="datatable-container">
      <table {...getTableProps()} className="datatable">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())} // Enable column sorting
                  className="datatable-header"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="datatable-row">
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="datatable-cell"
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
      <div className="pagination">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          {'<<'}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="pagination-button"
        >
          {'<'}
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="pagination-button"
        >
          {'>'}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="pagination-button"
        >
          {'>>'}
        </button>
        <span className="pagination-info">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span className="pagination-info">
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="pagination-input"
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="pagination-select"
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
          }
          return(<div>
            <UpdateProduct valueFromParent={Id}/>

          </div>)
};

export default DataTable;
