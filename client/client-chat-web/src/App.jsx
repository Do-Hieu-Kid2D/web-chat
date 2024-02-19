import { Routes, Route, Navigate } from "react-router-dom";

import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
// css bootstrap cần đặt đây mới ăn chứ
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
    const { user } = useContext(AuthContext);
    return (
        <>
            {/* APP chỉ dùng 1  component chat này để hiển thị UI thôi */}
            {/* LÚC NÀO CŨNG CÓ NavBar song rồi 3 cái ở dưới là tùy */}
            <NavBar />
            <Container>
                <Routes>
                    <Route path="/" element={user ? <Chat /> : <Login />} />
                    <Route
                        path="/login"
                        element={user ? <Chat /> : <Login />}
                    />
                    <Route
                        path="/register"
                        element={user ? <Chat /> : <Register />}
                    />
                    <Route path="*" element={user ? <Chat /> : <Login />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
