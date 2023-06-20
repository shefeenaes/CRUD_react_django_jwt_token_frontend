import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css';
import UpdateProduct from './UpdateProduct';

const ShowProducts = ({ onValueChange }) => {
  const [products, setProducts] = useState([]);
  const [isUpdate, setUpdateComponent] = useState(false);
  const [id, setId] = useState();

  const fetchProducts = async () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (!storedAccessToken) {
      // Handle missing access token
      console.error('Access token is missing');
      return;
    }

    const accessToken = storedAccessToken;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.get(
        'http://localhost:8000/api/showAllProducts/',
        config
      );

      if (response.status === 200) {
        const parsedData = response.data;
        setProducts(parsedData);
        console.log(parsedData);
      } else {
        // Handle API response error
        console.error('API response error:', response);
      }
    } catch (error) {
      // Handle API request error
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
            <button
              onClick={() => handleUpdate(row)}
              className="action-button update-button"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="action-button delete-button"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
      data: products,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const handleUpdate = (row) => {
    setId(row.original.id);
    setUpdateComponent(true);
    console.log('Updating row:', row);
  };

  const handleDelete = async (row) => {
    const id = row.original.id;
    const storedAccessToken = localStorage.getItem('accessToken');
    if (!storedAccessToken) {
      // Handle missing access token
      console.error('Access token is missing');
      return;
    }

    const accessToken = storedAccessToken;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      // Prompt the user for confirmation before deleting the product
      const shouldDelete = window.confirm('Are you sure you want to delete this product?');
      if (!shouldDelete) {
        return;
      }

      const response = await axios.delete(
        `http://127.0.0.1:8000/api/deleteProduct/${id}/`,
        config
      );

      if (response.status === 200) {
        console.log('response-->', response);
        toast.success('Row deleted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

        // Fetch the updated data after successful deletion
        fetchProducts();
      } else {
        // Handle API response error
        console.error('API response error:', response);
        toast.error('An unexpected error occurred', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      // Handle API request error
      console.error('API request error:', error);
      toast.error('An unexpected error occurred', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    console.log('Deleting row:', row);
  };

  if (!isUpdate) {
    return (
      <div>
        <div className="datatable-container">
          <table {...getTableProps()} className="datatable">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
                        <td {...cell.getCellProps()} className="datatable-cell">
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
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <UpdateProduct valueFromParent={id} onValueChange={onValueChange} />
    </div>
  );
};

export default ShowProducts;
