"use strict";
/*
 * Following functions were created using the help of:
 *   https://stackoverflow.com/questions/19330344/how-to-read-base64-vlq-code
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.programToShader = exports.createSourceMapTree = exports.Source = exports.numbersToBase64VLQ = exports.base64VLQtoNumbers = void 0;
var BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64VLQtoNumbers(vlq) {
    var data = vlq.split("").map(function (letter) { return BASE64_ALPHABET.indexOf(letter); });
    var numbers = [];
    var continuation, sign = null;
    var num = 0;
    var bitIdx = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var bits = data_1[_i];
        if (sign == null) {
            sign = bits & 0x1;
            num |= ((bits >> 1) & 15) << bitIdx;
            bitIdx += 4;
        }
        else {
            num |= (bits & 31) << bitIdx;
            bitIdx += 5;
        }
        continuation = bits >> 5;
        if (continuation == 0) {
            numbers.push(num * (sign == 0 ? 1 : -1));
            num = 0;
            bitIdx = 0;
            sign = null;
        }
    }
    return numbers;
}
exports.base64VLQtoNumbers = base64VLQtoNumbers;
function numbersToBase64VLQ(values) {
    var data = "";
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        // extract sign, only necessary in first step
        var sign = value < 0 ? 1 : 0;
        value = Math.abs(value);
        var num = value & 15;
        var cont = (value >> 4) != 0 ? 1 : 0;
        var bits = (cont << 5) | (num << 1) | sign;
        data += BASE64_ALPHABET[bits];
        value >>= 4;
        while (value != 0) {
            num = value & 63;
            cont = (value >> 5) != 0 ? 1 : 0;
            bits = (cont << 5) | num;
            data += BASE64_ALPHABET[bits];
            value >>= 5;
        }
    }
    return data;
}
exports.numbersToBase64VLQ = numbersToBase64VLQ;
var Source = /** @class */ (function () {
    function Source(name, lines) {
        this.name = name;
        this.lines = lines;
    }
    return Source;
}());
exports.Source = Source;
function createSourceMapTree(source, prog) {
    // Source was already imported, therefore we can skip - Prevents dependency cycles and multiple imports
    if (prog.sourceMap.sources.includes(source.name))
        return;
    prog.sourceMap.sources.push(source.name);
    for (var lineNumber = 0; lineNumber < source.lines.length; lineNumber++) {
        var line = source.lines[lineNumber];
        if (line instanceof Source) {
            createSourceMapTree(line, prog);
        }
        else {
            prog.sourceMap.mappings.push({
                generatedColumn: prog.code.length,
                originalSourceName: source.name,
                originalLine: lineNumber + 1,
                originalColumn: 0
            });
            prog.code += line + '\n';
        }
    }
    // Remove trailing newline
    prog.code = prog.code.substring(0, prog.code.length - 1);
}
exports.createSourceMapTree = createSourceMapTree;
function programToShader(prog) {
    /*
    let prevMap = [0, 0, 0, 0];
    const mappings = prog.sourceMap.mappings.map(m => {
      const sourceIdx = prog.sourceMap.sources.indexOf(m.originalSourceName);
      const newMap = [
        m.generatedColumn - prevMap[0],
        sourceIdx - prevMap[1],
        m.originalLine - prevMap[2],
        m.originalColumn - prevMap[3]
      ];
  
      prevMap = [
        m.generatedColumn,
        sourceIdx,
        m.originalLine,
        m.originalColumn
      ];
  
      return numbersToBase64VLQ(newMap);
    });*/
    return {
        code: prog.code,
        label: prog.sourceMap.file,
        // TODO: Figure out why sourceMap doesn't work.
        // Resources:
        //  https://web.dev/articles/source-maps
        //  https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createShaderModule
        //  https://gpuweb.github.io/gpuweb/wgsl/#identifier-comparison
        //  https://sourcemaps.info/spec.html
        /*sourceMap: {
          version: prog.sourceMap.version,
          file: prog.sourceMap.file,
          sourceRoot: "",
          sources: prog.sourceMap.sources,
          sourcesContent: prog.sourceMap.sources.map(_ => null),
          names: [],
          mappings: mappings.join(";")+";",
        },*/
    };
}
exports.programToShader = programToShader;
