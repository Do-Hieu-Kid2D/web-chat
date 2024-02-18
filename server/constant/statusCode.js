const severCode = {
    OKE_REQUEST_200: {
        code: 200,
        message: "REQUEST NGON",
    },
    INTERNAL_SERVER_ERROR_500: {
        code: 500,
        message: "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
    },
    NOT_FOUND_404: {
        code: 404,
        message: "Không tìm thấy tài nguyên.",
    },
    UNAUTHORIZED_401: {
        code: 401,
        message: "Truy cập không được ủy quyền.",
    },
    BAD_REQUEST_400: {
        code: 400,
        message: "Yêu cầu không hợp lệ. 400.",
    },
    FORBIDDEN_403: {
        code: 403,
        message: "Bị cấm. Máy chủ đã hiểu yêu cầu nhưng từ chối ủy quyền nó.",
    },
    CONFLICT_409: {
        code: 409,
        message:
            "Xung đột. Yêu cầu không thể hoàn thành do xung đột với trạng thái hiện tại của tài nguyên.",
    },
    TOO_MANY_REQUESTS_429: {
        code: 429,
        message:
            "Quá nhiều yêu cầu. Người dùng đã gửi quá nhiều yêu cầu trong một khoảng thời gian nhất định.",
    },
    // Thêm các mã lỗi khác ở đây nếu cần thiết
};

module.exports = severCode;
