import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { registerInfo, updateRegisterInfo } = useContext(AuthContext);

    return (
        <>
            <Form>
                <Row
                    style={{
                        height: "100vh",
                        justifyContent: "center",
                        paddingTop: "10%",
                    }}
                >
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Đăng ký</h2>
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
                                Đăng ký ngay
                            </Button>

                            <Alert variant="danger">
                                <p>Đã sảy ra lỗi!</p>
                            </Alert>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Register;
