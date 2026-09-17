/**
 * 前端构建产物上传到腾讯云 COS
 * 用法：pnpm upload <dist-dir> 或 node scripts/upload.js <dist-dir>
 */

import COS from "cos-nodejs-sdk-v5";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 凭据从环境变量读取，本地开发请在 .env.local 或 ~/.zshrc 中配置
// 必备：COS_SECRET_ID、COS_SECRET_KEY
// 可选：COS_BUCKET（默认 guide-1300453555）、COS_REGION（默认 ap-nanjing）、COS_REMOTE_PREFIX
function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`\x1b[31m[ERR]\x1b[0m 缺少环境变量 ${name}`);
    console.error("      可在 .env.local 中配置，或临时导出：export " + name + "=xxx");
    process.exit(2);
  }
  return v;
}

const SECRET_ID = requireEnv("COS_SECRET_ID");
const SECRET_KEY = requireEnv("COS_SECRET_KEY");
const BUCKET = process.env.COS_BUCKET || "guide-1300453555";
const REGION = process.env.COS_REGION || "ap-nanjing";

// 可选：远程路径前缀，例如部署到子目录
const REMOTE_PREFIX = process.env.COS_REMOTE_PREFIX || "";

// ---------- 初始化 COS ----------
const cos = new COS({
  SecretId: SECRET_ID,
  SecretKey: SECRET_KEY,
  Timeout: 30000,
});

// ---------- 入参校验 ----------
const distDirArg = process.argv[2];
if (!distDirArg) {
  console.error("\x1b[31m[ERR]\x1b[0m 缺少目录参数。用法: pnpm upload <dist-dir>");
  process.exit(2);
}

const distDir = path.resolve(__dirname, "..", distDirArg);
if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
  console.error(`\x1b[31m[ERR]\x1b[0m 目录不存在或不是目录: ${distDir}`);
  process.exit(2);
}

// ---------- 收集所有待上传文件 ----------
function collectFiles(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, base, out);
    } else if (stat.isFile()) {
      const rel = path.relative(base, full).replace(/\\/g, "/");
      out.push({ full, key: REMOTE_PREFIX ? `${REMOTE_PREFIX}/${rel}` : rel });
    }
  }
  return out;
}

const files = collectFiles(distDir);
if (files.length === 0) {
  console.warn(`\x1b[33m[WARN]\x1b[0m 目录为空，无文件可上传: ${distDir}`);
  process.exit(0);
}

console.log(
  `\x1b[36m[INFO]\x1b[0m 准备上传 ${files.length} 个文件到 cos://${BUCKET}/${REGION}${
    REMOTE_PREFIX ? "/" + REMOTE_PREFIX : ""
  }`
);

// ---------- 单文件上传 ----------
function uploadFile({ full, key }) {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        Body: fs.createReadStream(full),
        Headers: key.match(/\.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|webp)$/i)
          ? { "Cache-Control": "public, max-age=31536000, immutable" }
          : { "Cache-Control": "public, max-age=600" },
      },
      (err) => {
        if (err) {
          console.error(`\x1b[31m[FAIL]\x1b[0m ${key}`, err?.message || err);
          reject(err);
        } else {
          console.log(`\x1b[32m[OK]\x1b[0m   ${key}`);
          resolve();
        }
      }
    );
  });
}

// ---------- 并发上传（限流 8） ----------
async function runWithConcurrency(tasks, limit = 8) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (cursor < tasks.length) {
      const idx = cursor++;
      try {
        await tasks[idx]();
        results[idx] = { ok: true };
      } catch (e) {
        results[idx] = { ok: false, error: e };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

// ---------- 入口 ----------
(async () => {
  try {
    const start = Date.now();
    const results = await runWithConcurrency(
      files.map((f) => () => uploadFile(f)),
      8
    );
    const failed = results.filter((r) => !r.ok);
    const cost = ((Date.now() - start) / 1000).toFixed(1);

    console.log("");
    console.log(`\x1b[36m[INFO]\x1b[0m 上传完成：${files.length - failed.length}/${files.length} 成功，耗时 ${cost}s`);
    if (failed.length > 0) {
      console.error(`\x1b[31m[ERR]\x1b[0m  ${failed.length} 个文件失败`);
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m[ERR]\x1b[0m", err?.message || err);
    process.exit(1);
  }
})();