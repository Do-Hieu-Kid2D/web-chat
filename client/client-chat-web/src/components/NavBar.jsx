import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    console.log(`===>OKE: `);

    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.725rem" }}>
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
                                <Link
                                    to="/login"
                                    className="link-light text-decoration-none"
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
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="link-light text-decoration-none"
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
