import React, { lazy, useState, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/Navigation/ProtectedRoute";

const Home = lazy(() => import("../../pages/Home"));
const Symptoms = lazy(() => import("../../pages/Symptoms"));
const Symptom = lazy(() => import("../../pages/Symptom"));
const About = lazy(() => import("../../pages/About"));
const Contact = lazy(() => import("../../pages/Contact"));
const NotFound = lazy(() => import("../../pages/NotFound"));
const AddSymptom = lazy(() => import("../../pages/Add-Symptom"));
const AddUserSymptom = lazy(() => import("../../pages/Add-user-symptom"));
const AddDoctorSymptom = lazy(() => import("../../pages/Add-doctor-symptom"));
const Login = lazy(() => import("../../pages/Login"));
const Signup = lazy(() => import("../../pages/Signup"));
const Account = lazy(() => import("../../pages/Account"));
const Departments = lazy(() => import("../../pages/Departments"));
const Doctors = lazy(() => import("../../pages/Doctors"));

interface InfoArray {
  _id: number;
  name: string;
  description: string;
  thumbnail: string;
  department: string;
}

export const Navigation = () => {
  const [searchState, setSearchState] = useState<{
    result: InfoArray[];
    search: string;
    suggestions: InfoArray[];
  }>({
    result: [],
    search: "",
    suggestions: [],
  });

  return (
    <main role="main" aria-label="Main content">
      <Suspense fallback={<div aria-live="polite">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="symptoms/:id"
            element={
              <Symptoms searchState={searchState} setSearchState={setSearchState} />
            }
          />
          <Route path="symptom/:name" element={<Symptom />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="departments" element={<Departments />} />
          <Route path="doctors" element={<Doctors />} />

          <Route
            path="account"
            element={
              <ProtectedRoute
                element={<Account />}
                roles={["user", "admin", "doctor"]}
              />
            }
          />

          <Route
            path="add-symptom"
            element={
              <ProtectedRoute element={<AddSymptom />} roles={["admin"]} />
            }
          />

          <Route
            path="add-symptom-name"
            element={
              <ProtectedRoute element={<AddUserSymptom />} roles={["user", "admin"]} />
            }
          />

          <Route
            path="add-symptom-description"
            element={
              <ProtectedRoute
                element={<AddDoctorSymptom />}
                roles={["doctor"]}
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
};
