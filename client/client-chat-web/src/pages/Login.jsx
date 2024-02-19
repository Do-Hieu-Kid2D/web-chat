import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import React, { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
const Login = () => {
    const {
        user,
        loginInfo,
        loginError,
        isLoginLoading,
        updateLoginInfo,
        loginUser,
    } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row
                    style={{
                        height: "100vh",
                        justifyContent: "center",
                        paddingTop: "10%",
                    }}
                >
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2 style={{ color: "white", textAlign: "center" }}>
                                Đăng nhập
                            </h2>
                            <Form.Control
                                type="email"
                                placeholder="Nhập emai"
                                onChange={(e) => {
                                    updateLoginInfo({
                                        ...loginInfo,
                                        email: e.target.value,
                                    });
                                }}
                            ></Form.Control>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                onChange={(e) => {
                                    updateLoginInfo({
                                        ...loginInfo,
                                        password: e.target.value,
                                    });
                                }}
                            ></Form.Control>
                            <Button variant="primary" type="submit">
                                {isLoginLoading ? "Đang xử lý..." : "Đăng nhập"}
                            </Button>
                            {loginError && (
                                <Alert variant="danger">
                                    <p>{loginError}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Login;
