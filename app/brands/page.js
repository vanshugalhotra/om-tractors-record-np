"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { fetchData } from "@/utils/dbFuncs";
import { debounce } from "lodash";
import Image from "next/image";

import { FaRegEye, FaRegTrashAlt, FaSearch, FaEdit, FaPlus } from "react-icons/fa";

import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

const Brands = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchInitialBrands = async () => {
      try {
        const api = "/api/brand/getbrands";
        const initialBrands = await fetchData(api);
        setBrands(initialBrands); // Set state with fetched data
      } catch (error) {
        console.error("Error fetching initial Brands:", error);
        // Handle error if needed
      }
    };

    fetchInitialBrands(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures it runs only once after initial render

  // REACT STUFF
  useEffect(() => {
    const fetchResults = debounce(async () => {
      const api = `/api/brand/getbrands?search=${searchQuery}`;
      const results = await fetchData(api);
      setBrands(results);
    }, 500); // Adjust the debounce delay as needed

    fetchResults();
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUpdate = async (_id, name) => {
    const data = {
      _id,
      name,
    };
    const queryParams = Object.keys(data)
      .map((key) => {
        const encodedKey = `encoded_${encodeURIComponent(key)}`;
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join("&");

    const url = `/addbrand?${queryParams}`;

    router.push(url);
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Brands
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Your Brands
          </p>
        </div>
        <Link className="right-btn icon-btn" href={"/addbrand"}>
          <FaPlus className="w-6 h-6 text-white font-medium" />
          <span className="text-white font-medium px-2 text-lg">Add Brand</span>
        </Link>
      </div>
      <div className="my-8 rounded-lg border-2 border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="top-section py-6 px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="search-bar w-full border-gray-300">
            <FaSearch className="inline-flex text-gray-500 rounded-full cursor-pointer mx-2 up-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-bar-input"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
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
                    Logo
                  </th>
                  <th scope="col" className="table-heading">
                    Brand Name
                  </th>
                  <th scope="col" className="table-heading">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.length &&
                  brands.map(({ _id, name, logo }, index) => {
                    return (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={_id}
                      >
                        <td className="table-data text-gray-900 font-semibold">
                          {index + 1}.)
                        </td>
                        <th
                          scope="row"
                          className="flex items-center table-data text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {name && (
                            <Image
                              alt="Upload"
                              className="w-16 h-16"
                              layout="fixed"
                              width={58}
                              height={58}
                              objectFit="cover"
                              src={
                                !logo
                                  ? "/assets/images/default/brand.svg"
                                  : logo
                              }
                            />
                          )}
                        </th>
                        <td className="table-data">{name}</td>
                        <td className="table-data space-y-2">
                          <div
                            className="action-icon"
                            onClick={() => {
                              router.push(`/branddetails?_id=${_id}`);
                            }}
                          >
                            <FaRegEye className="normal-icon" />
                          </div>
                          <div
                            className="action-icon"
                            onClick={() => {
                              handleUpdate(_id, name);
                            }}
                          >
                            <FaEdit className="normal-icon mx-1" />
                          </div>
                          <div className="inline-block text-red-500 up-icon hover:text-red-700">
                            <FaRegTrashAlt className="normal-icon" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
