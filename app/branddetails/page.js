"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/utils/dbFuncs";
import { formatDate, raiseToast } from "@/utils/utilityFuncs";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import { FaRegEye } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoanDetails = () => {
  const searchParams = useSearchParams();
  const [branddetails, setBrandDetails] = useState({});
  const [productdetails, setProductdetails] = useState([]);

  const router = useRouter();

  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  useEffect(() => {
    const fetchBrandDetails = async () => {
      startLoading();
      try {
        const api = `/api/brand/getbranddetails?_id=${searchParams.get("_id")}`;
        const brand = await fetchData(api);
        setBrandDetails(brand.brand);
      } catch (error) {
        console.error("Error fetching brand details:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchBrandDetails(); // Invoke the async function to fetch data
  }, [searchParams]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const api = `/api/product/getproducts?search=${encodeURIComponent(
          branddetails.name
        )}`;

        const response = await fetchData(api);
        if (!response) {
          return;
        }
        setProductdetails(response);
      } catch (error) {
        console.error("Error fetching product detail:", error);
        raiseToast("error", "Failed to fetch product detail");
        return;
      }
    };

    fetchProductDetails();
  }, [branddetails.name]);

  const brandFields = [
    {
      title: "Brand Name",
      value: branddetails.name,
    },
  ];

  const images = [
    {
      title: "Brand Image",
      src: branddetails.logo
        ? branddetails.logo
        : "/assets/images/default/brand.svg",
    },
  ];

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Brand Details
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Full Details of Details
          </p>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="product-details outline-none py-8 px-6 border-none flex md:flex-row flex-col">
          <div className="">
            <ul className="md:w-2/3 border-b">
              {brandFields.map(({ title, value }, index) => (
                <li
                  className={`product-details-item ${
                    index % 2 === 1 ? "bg-gray-100" : ""
                  }`}
                  key={index}
                >
                  <h4 className="product-details-title">{title}</h4>
                  <h6 className="product-details-value">{value}</h6>
                </li>
              ))}
            </ul>

            <div className="px-4 my-10">
              <div className="text-2xl font-bold py-5 text-center text-gray-800 dark:text-gray-200">
                Products Related To{" "}
                <span className="bg-yellow-200 px-2 rounded text-gray-900 dark:text-gray-900">
                  {branddetails.name}
                </span>{" "}
                Brand
              </div>

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
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productdetails.length > 0 &&
                        productdetails.map(
                          (
                            {
                              _id,
                              productName,
                              code,
                              description,
                              type,
                              brand,
                              lastUpdated,
                              amount,
                              oldMRP,
                              discont,
                            },
                            index
                          ) => {
                            return (
                              <tr
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                key={_id}
                              >
                                <td className="table-data text-gray-900 font-semibold flex flex-col items-center">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {discont && (
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">
                                        Discont.
                                      </span>
                                    )}
                                  </div>
                                  <span>{index + 1}.)</span>
                                </td>
                                <td className="table-data">{productName}</td>
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
                                <td className="table-data">{description}</td>
                                <td className="table-data">{type.name}</td>
                                <td className="table-data">{brand.name}</td>
                                <td className="table-data">
                                  <div className="flex space-x-2 w-full">
                                    <div
                                      className="action-icon"
                                      onClick={() => {
                                        router.push(
                                          `/recorddetails?_id=${_id}`
                                        );
                                      }}
                                    >
                                      <FaRegEye className="normal-icon" />
                                    </div>
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
          </div>
          <div className="product-image-container relative md:w-1/3 mx-4 flex flex-col justify-start rounded-lg border border-gray-200 border-opacity-70 shadow-sm cursor-pointer max-h-screen overflow-y-auto">
            {images.map((image, index) => (
              <div key={index} className="product-image mx-2 my-4">
                <h3 className="text-center mb-2">{image.title}</h3>
                <Image
                  src={image.src}
                  alt={`${image.title}`}
                  width={400}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanDetails;
