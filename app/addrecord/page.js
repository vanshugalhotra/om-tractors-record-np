"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import Link from "next/link";
import { raiseToast } from "@/utils/utilityFuncs";
import { postData, fetchData } from "@/utils/dbFuncs";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import DobPicker from "@/components/Form/DobPicker";
import SuggestionInputWithID from "@/components/Form/SuggestionInput";

const AddProduct = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const router = useRouter();
  const searchParams = useSearchParams();

  const [productName, setProductName] = useState(
    searchParams.get("encoded_productName") ?? ""
  );
  const [type, setType] = useState(searchParams.get("encoded_type") ?? "");
  const [typeID, setTypeID] = useState(
    searchParams.get("encoded_typeID") ?? null
  );
  const [fetchedTypes, setFetchedTypes] = useState([]);
  const [brand, setBrand] = useState(searchParams.get("encoded_brand") ?? "");
  const [brandID, setBrandID] = useState(
    searchParams.get("encoded_brandID") ?? null
  );
  const [fetchedBrands, setFetchedBrands] = useState([]);
  const [amount, setAmount] = useState(searchParams.get("encoded_amount") ?? 0);

  const [code, setCode] = useState(searchParams.get("encoded_code") ?? "");
  const [description, setDescription] = useState(
    searchParams.get("encoded_description") ?? ""
  );

  // Convert searchParams value to boolean
  const [discont, setDiscont] = useState(
    searchParams.get("encoded_discont") === "true"
  );

  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [productCount, setProductCount] = useState("");

  const [_id, set_id] = useState(searchParams.get("encoded__id") ?? null);

  const handleDateChange = (date) => {
    setLastUpdated(date);
  };

  useEffect(() => {
    const fetchInitialTypes = async () => {
      try {
        const api = "/api/type/gettypes";
        const typesA = await fetchData(api);
        setFetchedTypes(typesA);
      } catch (error) {
        console.error("Error fetching initial types:", error);
        // Handle error if needed
      }
    };

    fetchInitialTypes(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures this runs once on mount
  useEffect(() => {
    const fetchInitialBrands = async () => {
      try {
        const api = "/api/brand/getbrands";
        const brands = await fetchData(api);
        setFetchedBrands(brands);
      } catch (error) {
        console.error("Error fetching initial brands:", error);
        // Handle error if needed
      }
    };

    fetchInitialBrands(); // Invoke the async function to fetch data
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await fetchData("/api/product/getproductcount");
        setProductCount(response.totalProducts);
      } catch (error) {
        console.error("Error fetching product count:", error);
        raiseToast("error", error.message);
      }
    };

    fetchProductCount();
  }, []);

  const submit = async () => {
    try {
      startLoading();
      if (!productName) {
        raiseToast("error", "Product Name is required!!");
        return;
      }
      if (!typeID) {
        raiseToast("error", "Type (Tractor) is required!!");
        return;
      }
      if (!brandID) {
        raiseToast("error", "Brand Name is required!!");
        return;
      }

      const data = {
        productName,
        type: typeID,
        brand: brandID,
        amount,
        code,
        description,
        lastUpdated,
        discont
      };

      let METHOD = "POST";
      let api = "/api/product/addproduct";

      if (_id) {
        // if it is an update request
        METHOD = "PATCH";
        api = "/api/product/updateproduct";
        data._id = _id;
      }

      // All uploads successful, proceed to save data in database
      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = _id
          ? "Product Updated Successfully!!"
          : "Product Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          setProductName("");
          setAmount(0);
          setCode("");
          setDescription("");
          if (_id) {
            router.push("/records");
          } else {
            router.push("/addrecord");
          }
        }, 1500);
      } else {
        raiseToast("info", "Product Already Exists!!");
      }
    } catch (error) {
      raiseToast("error", error.message);
      console.log(error.message);
    } finally {
      stopLoading();
      router.refresh();
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="top flex items-center justify-between md:flex-row flex-col">
        <div className="left">
          <h2 className="text-xl text-gray-900 font-medium tracking-wide leading-snug">
            Add Product
          </h2>
          <p className="text-xs text-gray-600 py-1 tracking-wide">
            Add New Product
          </p>
        </div>
        <div className="right mt-4 md:m-0">
          <h3 className="text-lg text-gray-700 font-semibold">
            Products: <span className="text-7xl">{productCount}</span>
          </h3>
        </div>
      </div>
      <div className="my-8 brands-card rounded-lg border-2 py-2 pb-4 border-gray-200 border-opacity-70  shadow-sm">
        <div className="inputs grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          {/* Product Name*/}
          <div className="lg:col-span-4">
            <InputContainer
              label={"Product Name"}
              value={productName}
              onChange={(event) => {
                setProductName(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Type */}
          <div className="lg:col-span-1">
            <SuggestionInputWithID
              label={"Tractor Type"}
              value={type}
              fullWidth={true}
              suggestions={fetchedTypes}
              setId={setTypeID}
            />
          </div>
          {/* Brand*/}
          <div className="lg:col-span-1">
            <SuggestionInputWithID
              label={"Brand Name (Company)"}
              value={brand}
              fullWidth={true}
              suggestions={fetchedBrands}
              setId={setBrandID}
            />
          </div>

          {/* Amount*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"MRP (₹)"}
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Code*/}
          <div className="lg:col-span-1">
            <InputContainer
              label={"Purchase Code"}
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
              }}
              fullWidth={true}
            />
          </div>
          {/* Description*/}
          <div className="lg:col-span-4">
            <InputContainer
              label={"Description"}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
              fullWidth={true}
            />
          </div>

          {/*Last Updated*/}
          <div className="lg:col-span-1">
            <div className="input-item">
              <label htmlFor="dob" className="input-label">
                Last Updated
              </label>
              <div className="relative border rounded-md border-[#919eab52] my-4 flex items-center justify-center flex-col py-2 cursor-pointer  transition-all duration-100 ease-in hover:bg-gray-100">
                <DobPicker
                  selectedDate={lastUpdated}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>

          {/* Discont */}
          <div className="lg:col-span-1">
            <div className="input-item">
              <label className="input-label uppercase">Discontinued</label>
              <div className="relative my-4 flex items-center">
                <input
                  type="checkbox"
                  checked={discont}
                  onChange={(event) => {
                    setDiscont(event.target.checked);
                  }}
                  className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2 text-gray-700">Discontinued</span>
              </div>
            </div>
          </div>
        </div>
        <div className="control-buttons mx-4 my-4">
          <div
            className="primary-btn bg-orange-400 hover:bg-orange-500"
            onClick={submit}
          >
            Submit
          </div>
          <Link
            href={"/addrecord"}
            className="primary-btn bg-gray-500 hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
