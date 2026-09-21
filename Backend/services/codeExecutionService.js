const axios = require("axios");
const vm = require("vm");

const isEqual = (a, b) => {
  if (a === b) return true;

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!isEqual(a[key], b[key])) return false;
    }
    return true;
  }

  // Fallback to string comparison for primitives after trimming
  return String(a).trim() === String(b).trim();
};

const executeJsLocally = (code, functionName, args) => {
  try {
    const sandbox = { console };
    vm.createContext(sandbox);

    const script = new vm.Script(`
${code}

(function() {
  let fn = null;
  const targetFnName = ${JSON.stringify(functionName)};
  try { fn = eval(targetFnName); } catch(e) {}
  if (typeof fn !== 'function') {
    try { fn = eval('solution'); } catch(e) {}
  }
  if (typeof fn !== 'function') {
    try { fn = eval('twoSum'); } catch(e) {}
  }

  if (typeof fn !== 'function') {
    throw new Error("Function '" + targetFnName + "' is not defined in your code");
  }

  const args = ${JSON.stringify(args)};
  if (Array.isArray(args)) {
    if (fn.length === 1 && args.length > 1 && !Array.isArray(args[0])) {
      return fn(args);
    }
    return fn(...args);
  } else {
    return fn(args);
  }
})();
`);

    const result = script.runInContext(sandbox, { timeout: 3000 });
    return { success: true, result };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const toCppLiteral = (val) => {
  if (val === null || val === undefined) return "nullptr";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return JSON.stringify(val);
  if (Array.isArray(val)) {
    return "{" + val.map(toCppLiteral).join(", ") + "}";
  }
  if (typeof val === "object") {
    return "{" + Object.values(val).map(toCppLiteral).join(", ") + "}";
  }
  return String(val);
};

const executeCode = async ({ code, testCases, functionName, language = "javascript" }) => {
  const results = [];

  const judgeUrl = process.env.CODE_EXECUTION_URL || "https://judge0-ce.p.rapidapi.com";
  const apiKey = process.env.CODE_EXECUTION_API_KEY;
  let host = "";
  try {
    host = new URL(judgeUrl).hostname;
  } catch (e) {
    host = "judge0-ce.p.rapidapi.com";
  }

  const isJs = language === "javascript" || language === "js";

  for (const testCase of testCases) {
    const args = testCase.input;
    const formattedExpected = typeof testCase.expectedOutput === "object"
      ? JSON.stringify(testCase.expectedOutput)
      : String(testCase.expectedOutput);

    // 1. NATIVE LOCAL JS VM EXECUTION (Fast, 100% reliable, zero API key/network issues)
    if (isJs) {
      const localRun = executeJsLocally(code, functionName, args);
      let actualOutput = "";
      let passed = false;
      let statusDescription = "Accepted";

      if (localRun.success) {
        const parsedStdout = localRun.result;
        actualOutput = typeof parsedStdout === "object" ? JSON.stringify(parsedStdout) : String(parsedStdout);
        passed = isEqual(parsedStdout, testCase.expectedOutput);
        statusDescription = passed ? "Accepted" : "Wrong Answer";
      } else {
        statusDescription = localRun.error || "Runtime Error";
        actualOutput = localRun.error || "Runtime Error";
      }

      results.push({
        input: testCase.input,
        expectedOutput: formattedExpected,
        actualOutput,
        passed,
        status: statusDescription,
      });

      continue;
    }

    // 2. REMOTE JUDGE0 EXECUTION FOR PYTHON / C++
    try {
      let wrappedCode = "";
      let languageId = 71;

      if (language === "python") {
        languageId = 71;
        wrappedCode = `
${code}

import json
import sys

args = json.loads(${JSON.stringify(JSON.stringify(args))})
try:
    if isinstance(args, list):
        import inspect
        func_obj = globals().get(${JSON.stringify(functionName)})
        sig = inspect.signature(func_obj) if func_obj else None
        if sig and len(sig.parameters) == 1 and len(args) > 1 and not isinstance(args[0], list):
            result = ${functionName}(args)
        else:
            result = ${functionName}(*args)
    else:
        result = ${functionName}(args)
    print("###RESULT###" + json.dumps(result))
except Exception as err:
    sys.stderr.write(str(err))
    sys.exit(1)
`;
      } else if (language === "cpp" || language === "c++") {
        languageId = 54;
        let cppArgs = "";
        if (Array.isArray(args)) {
          cppArgs = args.map(toCppLiteral).join(", ");
        } else {
          cppArgs = toCppLiteral(args);
        }

        const hasSolutionClass = /class\s+Solution/i.test(code);
        const callStatement = hasSolutionClass 
          ? `Solution solver;\n        auto result = solver.${functionName}(${cppArgs});`
          : `auto result = ${functionName}(${cppArgs});`;

        wrappedCode = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
#include <map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
#include <numeric>

using namespace std;

// Print helpers
template <typename T>
void printResult(const T& val) {
    cout << val;
}

void printResult(bool val) {
    cout << (val ? "true" : "false");
}

void printResult(const string& val) {
    cout << val;
}

template <typename T>
void printResult(const vector<T>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        printResult(vec[i]);
        if (i < vec.size() - 1) cout << ",";
    }
    cout << "]";
}

${code}

int main() {
    try {
        ${callStatement}
        cout << "###RESULT###";
        printResult(result);
        cout << endl;
    } catch (const exception& e) {
        cerr << e.what() << endl;
        return 1;
    }
    return 0;
}
`;
      }

      const response = await axios.post(
        `${judgeUrl}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: wrappedCode,
          language_id: languageId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": host,
            "x-rapidapi-key": apiKey,
          },
          timeout: 8000,
        }
      );

      const result = response.data;
      const stdout = result.stdout ? result.stdout.trim() : "";
      const stderr = result.stderr ? result.stderr.trim() : "";
      const compileOutput = result.compile_output ? result.compile_output.trim() : "";

      let actualOutput = "";
      let passed = false;
      let statusDescription = result.status?.description || "Unknown Status";

      if (result.status?.id === 3) { // Accepted
        const lines = stdout.split("\n");
        const resultLine = lines.find((line) => line.includes("###RESULT###"));

        let parsedStdout;
        if (resultLine) {
          const jsonStr = resultLine.substring(resultLine.indexOf("###RESULT###") + "###RESULT###".length).trim();
          try {
            parsedStdout = JSON.parse(jsonStr);
          } catch (e) {
            parsedStdout = jsonStr;
          }
          actualOutput = typeof parsedStdout === "object" ? JSON.stringify(parsedStdout) : String(parsedStdout);
        } else {
          try {
            parsedStdout = JSON.parse(stdout);
          } catch (e) {
            parsedStdout = stdout;
          }
          actualOutput = stdout;
        }

        let parsedExpected = testCase.expectedOutput;
        passed = isEqual(parsedStdout, parsedExpected);
      } else {
        statusDescription = stderr || compileOutput || statusDescription;
        actualOutput = stdout || stderr || compileOutput;
      }

      results.push({
        input: testCase.input,
        expectedOutput: formattedExpected,
        actualOutput,
        passed,
        status: statusDescription,
      });

    } catch (error) {
      console.error(
        "Remote code execution error:",
        error.response?.data || error.message
      );

      results.push({
        input: testCase.input,
        expectedOutput: formattedExpected,
        actualOutput: error.response?.data?.message || error.message || "Execution Error",
        passed: false,
        status: error.response?.data?.message || error.message || "Execution Error",
      });
    }
  }

  const allPassed =
    results.length > 0 &&
    results.every((test) => test.passed);

  return {
    allPassed,
    results,
  };
};

module.exports = executeCode;