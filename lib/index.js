"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var promises_1 = require("fs/promises");
var sourcemap_1 = require("./sourcemap");
function parse(loader, sourceCode, sourceName, context, importList) {
    return __awaiter(this, void 0, void 0, function () {
        var source, importPattern, lines, _i, lines_1, line, match, resolvedPath, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    source = new sourcemap_1.Source((0, path_1.basename)(sourceName), []);
                    importPattern = /#include "([.\/\w_-]+)"/gi;
                    lines = sourceCode.split("\n");
                    _i = 0, lines_1 = lines;
                    _e.label = 1;
                case 1:
                    if (!(_i < lines_1.length)) return [3 /*break*/, 9];
                    line = lines_1[_i];
                    match = importPattern.exec(line);
                    if (!(match != null)) return [3 /*break*/, 7];
                    return [4 /*yield*/, loader.getResolve()(context, "./" + match[1])];
                case 2:
                    resolvedPath = _e.sent();
                    loader.addDependency(resolvedPath);
                    if (!importList.includes(resolvedPath)) return [3 /*break*/, 3];
                    source.lines.push("\n"); // Insert empty line to preserve line number order
                    return [3 /*break*/, 6];
                case 3:
                    importList.push(resolvedPath);
                    _b = (_a = source.lines).push;
                    _c = parse;
                    _d = [loader];
                    return [4 /*yield*/, (0, promises_1.readFile)(resolvedPath, "utf-8")];
                case 4: return [4 /*yield*/, _c.apply(void 0, _d.concat([_e.sent(), (0, path_1.basename)(resolvedPath),
                        context,
                        importList]))];
                case 5:
                    _b.apply(_a, [_e.sent()]);
                    _e.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    source.lines.push(line);
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, source];
            }
        });
    });
}
function default_1(source) {
    this.cacheable();
    var callback = this.async();
    var prog = {
        sourceMap: {
            version: 3,
            mappings: [],
            sources: [],
            file: (0, path_1.basename)(this.resourcePath),
        },
        code: "",
    };
    parse(this, source, this.resourcePath, this.context, [this.resourcePath])
        .then(function (source) {
        (0, sourcemap_1.createSourceMapTree)(source, prog);
        callback(null, "export default ".concat(JSON.stringify((0, sourcemap_1.programToShader)(prog))));
    })
        .catch(function (err) { return callback(err); });
    return undefined;
}
exports.default = default_1;
