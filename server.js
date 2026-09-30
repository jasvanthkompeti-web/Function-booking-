/*
  Node.js frontend server + API proxy.

  Browser -> Node.js :3000 -> Java JDBC :8080 -> MySQL :3306

  This proxy fixes the common "Failed to fetch" / CORS problem
  caused by directly calling localhost:8080 from the browser.
*/

const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "0.0.0.0";
const PORT = 3000;
const JAVA_HOST = "127.0.0.1";
const JAVA_PORT = 8080;

const root = __dirname;

const mime = {
  ".html":"text/html; charset=utf-8",
  ".css":"text/css; charset=utf-8",
  ".js":"application/javascript; charset=utf-8",
  ".json":"application/json; charset=utf-8",
  ".png":"image/png",
  ".jpg":"image/jpeg",
  ".jpeg":"image/jpeg",
  ".svg":"image/svg+xml",
  ".ico":"image/x-icon"
};

function send(res,status,body,type="text/plain; charset=utf-8"){
  res.writeHead(status,{"Content-Type":type});
  res.end(body);
}

function proxyToJava(req,res){
  const options={
    hostname:JAVA_HOST,
    port:JAVA_PORT,
    path:req.url,
    method:req.method,
    headers:{
      "Content-Type":req.headers["content-type"] || "application/json"
    }
  };

  const proxy=http.request(options,(javaRes)=>{
    let data="";
    javaRes.setEncoding("utf8");
    javaRes.on("data",chunk=>data+=chunk);
    javaRes.on("end",()=>{
      res.writeHead(javaRes.statusCode || 502,{
        "Content-Type":javaRes.headers["content-type"] || "application/json; charset=utf-8"
      });
      res.end(data);
    });
  });

  proxy.on("error",()=>{
    send(res,503,JSON.stringify({
      success:false,
      message:"Java JDBC server is not running. Start BookingServer.java on port 8080."
    }), "application/json; charset=utf-8");
  });

  req.pipe(proxy);
}

const server=http.createServer((req,res)=>{
  if(req.url.startsWith("/api/")){
    proxyToJava(req,res);
    return;
  }

  let pathname=decodeURIComponent(req.url.split("?")[0]);
  if(pathname==="/") pathname="/index.html";

  const filePath=path.normalize(path.join(root,pathname));

  if(!filePath.startsWith(root)){
    send(res,403,"Forbidden");
    return;
  }

  fs.readFile(filePath,(err,data)=>{
    if(err){
      send(res,404,"Page not found");
      return;
    }
    const ext=path.extname(filePath).toLowerCase();
    send(res,200,data,mime[ext] || "application/octet-stream");
  });
});

server.listen(PORT,HOST,()=>{
  console.log("HallBook Node server running:");
  console.log("  http://localhost:"+PORT);
  console.log("API proxy:");
  console.log("  /api/* -> Java JDBC http://127.0.0.1:"+JAVA_PORT);
});
