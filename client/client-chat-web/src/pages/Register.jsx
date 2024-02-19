import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { postRequest } from "../utils/services.js";

const Register = () => {
    const {
        registerInfo,
        updateRegisterInfo,
        registerError,
        registerUser,
        isRegisterLoading,
    } = useContext(AuthContext);

    return (
        <>
            <Form onSubmit={registerUser}>
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
                                Đăng ký
                            </h2>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên"
                                onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        name: e.target.value,
                                    });
                                }}
                            ></Form.Control>
                            <Form.Control
                                type="email"
                                placeholder="Nhập emai"
                                onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        email: e.target.value,
                                    });
                                }}
                            ></Form.Control>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        password: e.target.value,
                                    });
                                }}
                            ></Form.Control>
                            <Button variant="primary" type="submit">
                                {isRegisterLoading
                                    ? "Xử lý đăng ký..."
                                    : "Đăng ký ngay"}
                            </Button>
                            {registerError && (
                                <Alert variant="danger">
                                    <p>{registerError}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Register;
