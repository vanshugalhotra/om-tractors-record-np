"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import Link from "next/link";
import { raiseToast } from "@/utils/utilityFuncs";
import { postData } from "@/utils/dbFuncs";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import BlobUpload from "@/components/Form/BlobUpload";
import Loading from "@/components/Loading/Loading";

const AddBrand = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const router = useRouter();
  const searchParams = useSearchParams();

  const [brandName, setBrandName] = useState(
    searchParams.get("encoded_name") ?? ""
  );

  const [logo, setLogo] = useState("");

  const [_id, set_id] = useState(searchParams.get("encoded__id") ?? null);

  const submit = async () => {
    try {
      startLoading();
      if (!brandName) {
        raiseToast("error", "Brand Name is required!!");
        return;
      }
      const data = {
        name: brandName,
        logo: logo,
      };

      let METHOD = "POST";
      let api = "/api/brand/addbrand";

      if (_id) {
        // if it is an update request
        METHOD = "PATCH";
        api = "/api/brand/updatebrand";
        data._id = _id;
      }

      // All uploads successful, proceed to save data in database
      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = _id
          ? "Brand Updated Successfully!!"
          : "Brand Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Brand Already Exists!!");
      }
    } catch (error) {
      raiseToast("error", error.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <section style={{ marginLeft: marginForSidebar }} className="py-8 px-8">
      {loading && <Loading />}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Add Brand</h2>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
          <svg
            className="w-5 h-5 inline-block mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 9.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414L11 11l1.293 1.293a1 1 0 01-1.414 1.414L10 12.414l-1.293 1.293a1 1 0 01-1.414-1.414L9.586 11 8.293 9.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          { _id ? 'Update Brand' : 'Add New Brand' }
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Brand Name */}
          <InputContainer
            label={"Brand Name"}
            value={brandName}
            onChange={(event) => {
              setBrandName(event.target.value);
            }}
            fullWidth={true}
          />

          {/* Logo */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-2">Logo</label>
            <BlobUpload name={"Logo"} setState={setLogo} imageVar={logo} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={submit}
          >
            { _id ? 'Update' : 'Submit' }
          </button>
          <Link
            href={"/"}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AddBrand;
