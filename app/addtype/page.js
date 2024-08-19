"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/SidebarContext";
import InputContainer from "@/components/Form/InputContainer";
import Link from "next/link";
import { raiseToast } from "@/utils/utilityFuncs";
import { postData } from "@/utils/dbFuncs";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import ColorPicker from "@/components/Form/ColorPicker";

const AddType = () => {
  const { marginForSidebar } = useSidebar();
  const { loading, startLoading, stopLoading } = useLoading(); // Access loading state and functions

  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("encoded_type") ?? "");
  const [color, setColor] = useState(searchParams.get("encoded_color") ?? "#ffffff");
  const [_id, set_id] = useState(searchParams.get("encoded__id") ?? null);

  const submit = async () => {
    try {
      startLoading();
      if (!type) {
        raiseToast("error", "Type is required!!");
        return;
      }
      const data = {
        name: type,
        color: color,
      };

      let METHOD = "POST";
      let api = "/api/type/addtype";

      if (_id) {
        // if it is an update request
        METHOD = "PATCH";
        api = "/api/type/updatetype";
        data._id = _id;
      }

      // All uploads successful, proceed to save data in database
      const response = await postData(METHOD, data, api);
      if (response.success) {
        let message = _id
          ? "Type Updated Successfully!!"
          : "Type Added Successfully!!";
        raiseToast("success", message);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        raiseToast("info", "Type Already Exists!!");
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
        <h2 className="text-2xl font-semibold text-gray-900">
          { _id ? 'Update Type' : 'Add New Type' }
        </h2>
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
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
          { _id ? 'Update Type' : 'Add New Type' }
        </h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Type Name */}
          <InputContainer
            label={"Type Name"}
            value={type}
            onChange={(event) => {
              setType(event.target.value);
            }}
            fullWidth={true}
          />

          {/* Color Picker */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2">Pick a Color</label>
            <ColorPicker color={color} setColor={setColor} />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={submit}
          >
            { _id ? 'Update' : 'Submit' }
          </button>
          <Link
            href={"/"}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AddType;
