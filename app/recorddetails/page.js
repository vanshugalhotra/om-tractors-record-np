"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { useSearchParams } from "next/navigation";
import { fetchData } from "@/utils/dbFuncs";
import { formatDate } from "@/utils/utilityFuncs";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";

const RecordDetails = () => {
  const searchParams = useSearchParams();
  const [productdetails, setProductdetails] = useState(null);
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  useEffect(() => {
    const fetchProductDetails = async () => {
      startLoading();
      try {
        const api = `/api/product/getproductdetails?_id=${searchParams.get(
          "_id"
        )}`;
        const product = await fetchData(api);
        setProductdetails(product.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Handle error if needed
      } finally {
        stopLoading();
      }
    };

    fetchProductDetails(); // Invoke the async function to fetch data
  }, [searchParams]);

  let productFields = [];
  if (productdetails) {
    productFields = [
      {
        title: "Product Name",
        value: productdetails.productName,
      },
      {
        title: "MRP (₹)",
        value: `₹ ${productdetails.oldMRP}    →   ₹ ${productdetails.amount}  `,
      },
      {
        title: "Last Updated",
        value: formatDate(productdetails.lastUpdated),
      },
      {
        title: "Tractor Type",
        value: productdetails.type.name,
      },
      {
        title: "Brand (Company) ",
        value: productdetails.brand.name,
      },
      {
        title: "Purchase Code",
        value: productdetails.code,
      },
      {
        title: "Description",
        value: productdetails.description,
      },
    ];
  }

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Record Details
          </h2>
          <p className="text-sm text-gray-600 py-1 tracking-wide">
            Full Details of Record
          </p>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border border-gray-200 border-opacity-70 pb-8 shadow-sm">
        <div className="product-details outline-none py-8 px-6 border-none flex md:flex-row flex-col">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productFields.map(({ title, value }, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                  <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecordDetails;
