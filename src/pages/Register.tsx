// src/components/MultiStepForm.tsx
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Step1 from "../component/Step1";
import Step2 from "../component/Step2";
// import { AvatarGroup } from "@mui/material";
// Define the structure of form values
interface FormValues {
  name: string;
  email: string;
  role: string;
  avatar: string;
  city: string;
  zipCode: number;
  username: string;
  password: string;
}

// Initial form values

const initialValues: FormValues = {
  name: "",
  email: "",
  role: "",
  avatar: "",
  city: "",
  zipCode: 0,
  username: "",
  password: "",
};

// Validation schemas for each step
const validationSchema = [
  Yup.object({
    name: Yup.string()
      .required("First Name is required")
      .min(2, "Must be at least 2 characters"),
    role: Yup.string().required("Role is required"),
    avatar: Yup.string().required("Avatar is required"),
  }),
  Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Must be at least 8 characters"),
  }),
];

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (step === 2) {
      alert("You have been registered!");
      console.log(values);

      try {
        const response = await axios.post(
          " https://api.escuelajs.co/api/v1/users/",
          {
            name: values.name,
            role: values.role,
            avatar: values.avatar,
            email: values.email,
            password: values.password,
          }
        );

        const { accessToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        navigate("/login");
      } catch (error) {
        console.error("There was an error submitting the form!", error);
      } finally {
        setSubmitting(false);
      }
    } else {
      handleNext();
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema[step - 1]}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <div className="max-w-md mx-auto mt-10">
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div>
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
            </div>
            {step > 1 && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5"
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isSubmitting}
            >
              {step === 2 ? "Submit" : "Next"}
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default RegisterForm;
