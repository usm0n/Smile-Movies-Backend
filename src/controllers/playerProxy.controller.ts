import * as zlib from "zlib";
import { IncomingMessage, ServerResponse } from "http";
import { Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";

const modifyResponse = (proxyRes: IncomingMessage, res: Response) => {
    let chunks: Buffer[] = [];
  
    proxyRes.on("data", (chunk) => {
      chunks.push(chunk);
    });
  
    proxyRes.on("end", () => {
      const buffer = Buffer.concat(chunks);
  
      let encoding = proxyRes.headers["content-encoding"];
      let decodedBody: string;
  
      if (encoding === "gzip") {
        decodedBody = zlib.gunzipSync(buffer).toString();
      } else if (encoding === "deflate") {
        decodedBody = zlib.inflateSync(buffer).toString();
      } else if (encoding === "br") {
        decodedBody = zlib.brotliDecompressSync(buffer).toString();
      } else {
        decodedBody = buffer.toString();
      }
  
      // Inject CSS into the HTML response
      decodedBody = decodedBody.replace(
        "</head>",
        `<style>
          body, html { margin: 0; padding: 0; overflow: hidden; }
          iframe { width: 100vw !important; height: 100vh !important; border: none !important; position: absolute; top: 0; left: 0; }
        </style></head>`
      );
  
      // Remove compression headers
      delete proxyRes.headers["content-encoding"];
      delete proxyRes.headers["content-length"];
  
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      res.end(decodedBody);
    });
  };
  
  // Proxy Middleware
  export const proxy = createProxyMiddleware({
    target: "https://vidsrc.xyz",
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader("Referer", "https://vidsrc.xyz");
        proxyReq.setHeader("Accept-Encoding", "gzip, deflate, br");
      },
      proxyRes: (proxyRes, req, res) => {
        modifyResponse(proxyRes, res as Response);
      },
    },
  });