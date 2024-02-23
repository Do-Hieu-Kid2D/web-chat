import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/chatContext";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // Sử dụng hook useNavigate

    useEffect(() => {
        if (user) {
            navigate("/", { replace: true }); // Thực hiện điều hướng đến /
        }
    }, [user, navigate]); // Đảm bảo hook navigate được tham chiếu trong dependencies

    return (
        <ChatContextProvider user={user}>
            <NavBar />
            <Container>
                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Container>
        </ChatContextProvider>
    );
}

export default App;
