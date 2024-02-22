import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import Notification from "./Notification";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="dark" className="mb-2" style={{ height: "3.725rem" }}>
            <Container style={{}}>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">
                        Chat Web
                    </Link>
                </h2>
                <h5
                    className="text-warning"
                    style={{
                        alignSelf: "center",
                    }}
                >
                    {user ? `Logged in as ${user.name}` : ""}
                </h5>
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        {user && (
                            <>
                                <Notification></Notification>
                                <Link
                                    to="/login"
                                    className="link-light text-decoration-none"
                                    style={{
                                        padding: 5,
                                        background: "#ff6536",
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        borderRadius: 20,
                                        marginLeft: 10,
                                    }}
                                    onClick={() => {
                                        logoutUser();
                                    }}
                                >
                                    Logout
                                </Link>
                            </>
                        )}

                        {!user && (
                            <>
                                !user &&{" "}
                                <Link
                                    to="/login"
                                    className="link-light text-decoration-none"
                                    style={{
                                        padding: 5,
                                        background: "#ff6536",
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        borderRadius: 20,
                                        marginRight: 10,
                                    }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="link-light text-decoration-none"
                                    style={{
                                        padding: 5,
                                        background: "#ff6536",
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        borderRadius: 20,
                                    }}
                                >
                                    Register
                                </Link>
                                !user &&{" "}
                            </>
                        )}
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;
