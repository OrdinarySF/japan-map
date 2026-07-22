# 大阪 × 东京 行程地图

旅行路上查看行程：默认「今天」、详情 + 导航、断网可读缓存。

## 本地预览

```bash
cd japan-map
python3 -m http.server 8765 --bind 0.0.0.0
```

打开 http://localhost:8765/

## 改行程（加密）

1. 编辑明文 `itinerary.md`（仅本机 / **private 仓库**）
2. 重新加密：

```bash
ITINERARY_PASS='你的口令' node tools/encrypt-itinerary.mjs
# 或把口令放在本地文件（已 gitignore）：
# ITINERARY_PASS=$(cat .itinerary-passphrase) node tools/encrypt-itinerary.mjs
```

3. 提交并推送 **`itinerary.enc.json`**（密文）
4. 手机刷新后用**同一口令**解锁

> 私有仓库也可以加密：防止误改 public、协作误传、设备借给别人时被直接打开明文。

## 部署

- **Private 仓库**：代码不公开；网页需另找带访问控制的托管，或只用本机服务器 + 离线缓存。
- **若壳子必须上公网**：只发布密文 `itinerary.enc.json`，**不要**把明文 `itinerary.md` 和口令提交到公开处。
- 当前推荐：**private 仓库 + 加密密文 + 本机/可信设备解锁**。

```bash
python3 -m http.server 8765
# 浏览器打开后输入口令
```

出发前用 Wi‑Fi 解锁一次，断网仍可读已缓存行程。

## 离线能力

- Service Worker 缓存：壳子 + `itinerary.enc.json` + Leaflet
- 解锁后 `localStorage` 缓存**解密后的行程**（仅本机）
- 断网仍可看今日时间线；地图瓦片/搜索仍要网络

## 使用要点

- 「今天」按 **日本时区**，**凌晨 4:00** 切日
- 点景点展开详情 → 去导航（我的位置 / 酒店 / 自选）
- 导航跳转 Google / 高德，本页不自建导航
