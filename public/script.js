// public/script.js

async function reviewCode(){

document.getElementById("loading")
.innerHTML =
"⏳ AI Analyzing Code...";

const code =
document.getElementById("code")
.value;

const response =
await fetch("/review",{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({code})

});

const data =
await response.json();

document.getElementById("language")
.innerHTML =
`<b>Language:</b>
${data.language}`;

document.getElementById("complexity")
.innerHTML =
`<b>Complexity:</b>
${data.complexity}`;

document.getElementById("score")
.innerHTML =
`<b>Quality Score:</b>
${data.qualityScore}/100`;

document.getElementById("fullReport")
.innerHTML = `

<h2>
AI Review Summary
</h2>

<p>
Detected Language:
${data.language}
</p>

<p>
Complexity:
${data.complexity}
</p>

<p>
Quality Score:
${data.qualityScore}/100
</p>

<p>
Issues Found:
${data.issues.length}
</p>

`;

document.getElementById("aiReview")
.innerText =
data.aiReview;

let html = "";

data.issues.forEach(issue=>{

html += `

<div class="issue-box">

<h4>
${issue.severity}
</h4>

<p>

<b>Issue:</b>

${issue.issue}

</p>

<p>

<b>Fix:</b>

${issue.fix}

</p>

</div>

`;

});

document.getElementById("issues")
.innerHTML = html;

let high = 0;
let medium = 0;
let low = 0;

data.issues.forEach(issue=>{

if(issue.severity==="High")
high++;

if(issue.severity==="Medium")
medium++;

if(issue.severity==="Low")
low++;

});

document.getElementById("severity")
.innerHTML = `

<h3>
🚨 Severity Table
</h3>

<p>
High: ${high}
</p>

<p>
Medium: ${medium}
</p>

<p>
Low: ${low}
</p>

`;

document.getElementById(
"optimizedCode"
).innerText =
data.optimized;

document.getElementById("loading")
.innerHTML =
"✅ AI Analysis Complete";

}

function showTab(tabId){

const tabs =
document.querySelectorAll(
".tab-content"
);

tabs.forEach(tab=>{

tab.style.display =
"none";

});

document.getElementById(tabId)
.style.display =
"block";

}

function toggleMode(){

document.body.classList
.toggle("light");

}

function downloadReport(){

const text =
document.getElementById(
"fullReport"
).innerText

+

"\n\n"

+

document.getElementById(
"aiReview"
).innerText;

const blob =
new Blob([text],{

type:"text/plain"

});

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"AI_Report.txt";

a.click();

}

showTab("report");
