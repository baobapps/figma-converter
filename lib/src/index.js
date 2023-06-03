"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./environments");
exports.default = () => {
    return 'Hello World!' + process.env.MY_SECRET;
};
