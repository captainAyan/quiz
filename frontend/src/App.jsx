import "./App.css";
import "./styles/table.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./app/store";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Header from "./components/Header";
import Edit from "./pages/Edit";
import Create from "./pages/Create";
import Quiz from "./pages/Quiz";
import Report from "./pages/Report";
import MarkSheets from "./pages/MarkSheets";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          <Route path="create/" element={<Create />} />
          <Route path="edit/:id" element={<Edit />} />

          <Route path="quiz/:id" element={<Quiz />} />

          <Route path="report/:id" element={<Report />} />
          <Route path="marksheets/" element={<MarkSheets />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* <Footer /> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
