"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { fetchData } from "@/utils/dbFuncs";
import { debounce } from "lodash";

import {
  FaRegEye,
  FaRegTrashAlt,
  FaSearch,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import { formatDate, raiseToast } from "@/utils/utilityFuncs";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

const Records = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductID, setSelectedProductID] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const router = useRouter();

  // Fetch initial products with limit
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        startLoading();
        const api = "/api/product/getproducts?limit=20";
        const initProducts = await fetchData(api);
        setProducts(initProducts); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching initial products:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchInitialProducts(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures it runs only once after initial render

  // Fetch search results if searchQuery is not blank
  useEffect(() => {
    if (!triggerSearch) return;

    const fetchResults = async () => {
      try {
        // Fetch results based on search query and sort option
        startLoading();
        const api = `/api/product/getproducts?search=${searchQuery}&sort=${sortOption}`;
        const results = await fetchData(api);
        setProducts(results);
        setTriggerSearch(false); // Reset the trigger after fetching results
      } catch (error) {
        console.error("Error fetching search results:", error);
        // Handle error if needed
        setTriggerSearch(false); // Reset the trigger in case of an error
      } finally {
        stopLoading();
      }
    };

    fetchResults();
  }, [triggerSearch]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUpdate = async (
    _id,
    productName,
    amount,
    type,
    brand,
    code,
    description,
    discont
  ) => {
    const data = {
      _id: _id,
      productName: productName,
      amount: amount,
      type: type.name,
      brand: brand.name,
      code: code,
      description: description,
      typeID: type._id,
      brandID: brand._id,
      discont: discont,
    };
    const queryParams = Object.keys(data)
      .map((key) => {
        const encodedKey = `encoded_${encodeURIComponent(key)}`;
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join("&");

    const url = `/addrecord?${queryParams}`;

    router.push(url);
  };

  const handleDelete = async (_id) => {
    setSelectedProductID(_id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/product/deleteproduct?_id=${selectedProductID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        raiseToast("success", "Product Deleted Successfully!!");
        // Optionally, refresh the product list or handle successful deletion
      } else {
        raiseToast(
          "error",
          `Failed to delete the product due to ${response.statusText}`
        );
      }
    } catch (error) {
      raiseToast("error", `Failed to delete the product : ${error}`);
    } finally {
      router.refresh();
    }
  };

  const handleSortChange = (event) => {
    const selectedSortOption = event.target.value;
    setSortOption(selectedSortOption);
    const sort = sortOptions.find(
      (option) => option.title === selectedSortOption
    );
    if (sort) {
      sort.todo();
    }
  };

  const sortOptions = [
    {
      title: "Recently Added First",
      todo: () => setSortOption("recentlyAddedFirst"),
    },
    {
      title: "Recently Added Last",
      todo: () => setSortOption("recentlyAddedLast"),
    },
    {
      title: "Recently Modified First",
      todo: () => setSortOption("recentlyModifiedFirst"),
    },
    {
      title: "Recently Modified Last",
      todo: () => setSortOption("recentlyModifiedLast"),
    },
  ];

  const handleSearchClick = () => {
    setTriggerSearch(true);
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Records
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Your Records
          </p>
        </div>
        <Link className="right-btn icon-btn" href={"/addrecord"}>
          <FaPlus className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">
            Add Record
          </span>
        </Link>
      </div>
      <div className="my-8 rounded-lg border-2 border-gray-200 border-opacity-70 pb-8 shadow-sm w-full">
        <div className="top-section py-6 px-4 flex flex-col md:flex-row justify-between items-center w-full">
          <div className="search-bar w-full flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaSearch className="inline-flex text-gray-500 cursor-pointer mx-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-3 focus:outline-none"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              onClick={handleSearchClick}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-r-lg"
            >
              Search
            </button>
          </div>

          <div className="mt-6 md:mt-0 md:ml-4 relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 cursor-pointer focus:outline-none focus:border-orange-500"
              onChange={handleSortChange}
              value={sortOption}
            >
              <option value="">
                {sortOption === "" ? "Sort By" : sortOption}
              </option>
              {sortOptions.map((option, index) => (
                <option key={index} value={option.title}>
                  {option.title}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293l3.293 3.293 3.293-3.293 1.414 1.414-4.707 4.707-4.707-4.707z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div className="relative overflow-x-auto">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="table-heading">
                    Sr No.
                  </th>
                  <th scope="col" className="table-heading">
                    Product Name
                  </th>
                  <th scope="col" className="table-heading">
                    MRP (₹)
                  </th>
                  <th scope="col" className="table-heading">
                    Last Updated
                  </th>
                  <th scope="col" className="table-heading">
                    Code
                  </th>
                  <th scope="col" className="table-heading">
                    Description
                  </th>
                  <th scope="col" className="table-heading">
                    Type
                  </th>
                  <th scope="col" className="table-heading">
                    Brand
                  </th>
                  <th scope="col" className="table-heading">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 &&
                  products.map(
                    (
                      {
                        _id,
                        productName,
                        amount,
                        type,
                        brand,
                        code,
                        description,
                        lastUpdated,
                        oldMRP,
                        discont,
                      },
                      index
                    ) => {
                      return (
                        <tr
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                          style={{ backgroundColor: type.color }}
                          key={_id}
                        >
                          <td className="table-data text-gray-900 font-semibold flex flex-col items-center">
                            <div className="flex items-center space-x-2 mb-1">
                              {brand.original && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                  ORG
                                </span>
                              )}
                              {discont && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
                                  Discont.
                                </span>
                              )}
                            </div>
                            <span>{index + 1}.)</span>
                          </td>
                          <td className="table-data capitalize">
                            {productName}
                          </td>
                          <td className="table-data flex flex-col md:flex-row items-center justify-between space-y-1 md:space-y-0 md:space-x-2">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
                              ₹ {oldMRP}
                            </span>
                            <span className="text-gray-500 mx-2 font-extrabold">
                              {"→"}
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md font-bold">
                              ₹ {amount}
                            </span>
                          </td>
                          <td className="table-data">
                            {formatDate(lastUpdated)}
                          </td>
                          <td className="table-data">{code}</td>
                          <td className="table-data capitalize">
                            {description}
                          </td>
                          <td className="table-data">{type.name}</td>
                          <td className="table-data uppercase">
                            {brand ? brand.name : ""}
                          </td>
                          <td className="table-data space-y-2">
                            <div
                              className="action-icon"
                              onClick={() => {
                                router.push(`/recorddetails?_id=${_id}`);
                              }}
                            >
                              <FaRegEye className="normal-icon" />
                            </div>
                            <div
                              className="action-icon"
                              onClick={() => {
                                handleUpdate(
                                  _id,
                                  productName,
                                  amount,
                                  type,
                                  brand,
                                  code,
                                  description,
                                  discont
                                );
                              }}
                            >
                              <FaEdit className="normal-icon mx-1" />
                            </div>
                            <div
                              className="inline-block text-red-500 up-icon hover:text-red-700"
                              onClick={() => {
                                handleDelete(_id);
                              }}
                            >
                              <FaRegTrashAlt className="normal-icon" />
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete the product, This action cannot be undone."
      />
    </section>
  );
};

export default Records;
