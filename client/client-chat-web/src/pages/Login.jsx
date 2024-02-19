import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

const Login = () => {
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
                            <h2>Đăng nhập</h2>
                            <Form.Control
                                type="email"
                                placeholder="Nhập emai"
                            ></Form.Control>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                            ></Form.Control>
                            <Button variant="primary" type="submit">
                                Đăng nhập
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

export default Login;
