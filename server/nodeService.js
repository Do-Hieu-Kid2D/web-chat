var Service = require("node-windows").Service;

var svc = new Service({
    name: "A1_server_api_chat_web",
    description: "Sever api cho chat web.",
    script: "E:\\work_code\\REACT_JS\\chat-app\\server\\index.js",
    nodeOptions: ["--harmony", "--max_old_space_size=4096"],
    //, workingDirectory: '...'
    //, allowServiceLogon: true
});

svc.on("install", function () {
    svc.start();
});

svc.install();
