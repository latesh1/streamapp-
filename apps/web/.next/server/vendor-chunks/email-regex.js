"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/email-regex";
exports.ids = ["vendor-chunks/email-regex"];
exports.modules = {

/***/ "(ssr)/../../node_modules/email-regex/index.js":
/*!***********************************************!*\
  !*** ../../node_modules/email-regex/index.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ emailRegex)\n/* harmony export */ });\nconst regex = '[^\\\\.\\\\s@:](?:[^\\\\s@:]*[^\\\\s@:\\\\.])?@[^\\\\.\\\\s@]+(?:\\\\.[^\\\\.\\\\s@]+)*';\n\nfunction emailRegex({exact} = {}) {\n\treturn exact ? new RegExp(`^${regex}$`) : new RegExp(regex, 'g');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL2VtYWlsLXJlZ2V4L2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFFZSxxQkFBcUIsT0FBTyxJQUFJO0FBQy9DLCtCQUErQixNQUFNO0FBQ3JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2ViLWFwcC8uLi8uLi9ub2RlX21vZHVsZXMvZW1haWwtcmVnZXgvaW5kZXguanM/MjI5MSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCByZWdleCA9ICdbXlxcXFwuXFxcXHNAOl0oPzpbXlxcXFxzQDpdKlteXFxcXHNAOlxcXFwuXSk/QFteXFxcXC5cXFxcc0BdKyg/OlxcXFwuW15cXFxcLlxcXFxzQF0rKSonO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbWFpbFJlZ2V4KHtleGFjdH0gPSB7fSkge1xuXHRyZXR1cm4gZXhhY3QgPyBuZXcgUmVnRXhwKGBeJHtyZWdleH0kYCkgOiBuZXcgUmVnRXhwKHJlZ2V4LCAnZycpO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/email-regex/index.js\n");

/***/ })

};
;