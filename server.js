require("dotenv").config();
// server.js

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

/* =========================
   GROQ API
========================= */

const groq = new Groq({

apiKey:"YOUR_GROQ_API_KEY"

});

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

/* =========================
   LANGUAGE DETECTION
========================= */

function detectLanguage(code){

if(code.includes("def "))
return "Python";

if(code.includes("console.log"))
return "JavaScript";

if(code.includes("#include"))
return "C++";

if(code.includes("<html"))
return "HTML";

return "Unknown";

}

/* =========================
   COMPLEXITY
========================= */

function complexity(code){

let score = 1;

const patterns = [

/if/g,
/for/g,
/while/g,
/try/g,
/catch/g

];

patterns.forEach(p=>{

const match = code.match(p);

if(match){

score += match.length;

}

});

return score;

}

/* =========================
   RULE BASED ANALYSIS
========================= */

function analyze(code){

let issues = [];

if(code.includes("eval(")){

issues.push({

severity:"High",

issue:"Dangerous eval() detected",

fix:"Avoid eval() due to security risks"

});

}

if(code.includes("password")){

issues.push({

severity:"High",

issue:"Hardcoded password detected",

fix:"Use environment variables"

});

}

if(code.includes("def")
&& !code.includes(":")){

issues.push({

severity:"High",

issue:"Missing colon in function",

fix:"Add : after function"

});

}

if(code.includes("for")
&& !code.includes(":")){

issues.push({

severity:"Medium",

issue:"Possible missing colon in loop",

fix:"Add : after loop"

});

}

if(code.includes("input(")
&& !code.includes("int(")){

issues.push({

severity:"Low",

issue:"Input may remain string",

fix:"Use int() conversion"

});

}

if(issues.length===0){

issues.push({

severity:"Info",

issue:"No major issue found",

fix:"Code structure looks good"

});

}

return issues;

}

/* =========================
   GROQ AI REVIEW
========================= */

async function aiReview(code){

const chat =
await groq.chat.completions.create({

messages:[

{

role:"system",

content:
"You are an expert AI code reviewer."

},

{

role:"user",

content:`

Analyze this code carefully.

Give:

1. Bugs
2. Security Problems
3. Optimization Suggestions
4. Best Practices
5. Improvements

Code:

${code}

`

}

],

model:"llama-3.3-70b-versatile"

});

return chat.choices[0]
.message.content;

}

/* =========================
   REVIEW API
========================= */

app.post("/review",
async(req,res)=>{

try{

const code =
req.body.code || "";

const lang =
detectLanguage(code);

const issues =
analyze(code);

const aiResult =
await aiReview(code);

const score =
Math.max(
100 - complexity(code)*5,
50
);

const optimized =
code.replace(/var /g,"let ");

res.json({

language:lang,

complexity:
complexity(code),

qualityScore:score,

issues:issues,

optimized:optimized,

aiReview:aiResult

});

}catch(error){

res.json({

language:"Unknown",

complexity:0,

qualityScore:0,

issues:[{

severity:"Critical",

issue:error.message,

fix:"Check API key"

}],

optimized:"",

aiReview:"AI analysis failed"

});

}

});

/* =========================
   SERVER
========================= */

app.listen(3000,()=>{

console.log(
"SmartCode AI Studio running on http://localhost:3000"
);

});