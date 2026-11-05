/**
 * ziwei-wuxingju 自测脚本
 * 运行：node test.js
 * 通过的标准：全部输出 "ok"，无 "FAIL"。
 */
'use strict';
const Ziwei = require('./ziwei.js');

let failed = 0;
function check(cond, msg) {
  if (cond) { console.log('ok   ' + msg); }
  else { failed++; console.error('FAIL ' + msg); }
}

/* ---- 公历 → 农历 ---- */
{
  const t = Ziwei.solar2lunar(2024, 2, 10);
  check(t && t.lYear === 2024 && t.lMonth === 1 && t.lDay === 1 && !t.isLeap,
    '2024-02-10 → 农历甲辰年正月初一 (got ' + JSON.stringify(t) + ')');
}
{
  const t = Ziwei.solar2lunar(2026, 2, 17);
  check(t && t.lYear === 2026 && t.lMonth === 1 && t.lDay === 1,
    '2026-02-17 → 农历丙午年正月初一 (got ' + JSON.stringify(t) + ')');
}
{
  const t = Ziwei.solar2lunar(2023, 3, 22);
  check(t && t.isLeap && t.lMonth === 2 && t.lDay === 1,
    '2023-03-22 → 闰二月初一 (got ' + JSON.stringify(t) + ')');
}
{
  const t = Ziwei.solar2lunar(2000, 1, 1);
  check(t && t.lYear === 1999 && t.lMonth === 11 && t.lDay === 25,
    '2000-01-01 → 农历1999年十一月廿五 (got ' + JSON.stringify(t) + ')');
}

/* ---- 立春（节气表）---- */
check(Ziwei.getTerm(2025, 3) === 3, '2025 年立春 = 2月3日 (got ' + Ziwei.getTerm(2025, 3) + ')');
check(Ziwei.getTerm(2024, 3) === 4, '2024 年立春 = 2月4日 (got ' + Ziwei.getTerm(2024, 3) + ')');
check(Ziwei.getTerm(2026, 3) === 4, '2026 年立春 = 2月4日 (got ' + Ziwei.getTerm(2026, 3) + ')');

/* ---- 年柱年界 ---- */
check(Ziwei.calc(2026, 2, 5, 0, 'lichun').gzYear === '丙午', '立春界：2026-02-05 → 丙午');
check(Ziwei.calc(2026, 2, 3, 0, 'lichun').gzYear === '乙巳', '立春界：2026-02-03 → 乙巳');
check(Ziwei.calc(2026, 2, 5, 0, 'newyear').gzYear === '乙巳', '正月初一界：2026-02-05（春节前）→ 乙巳');
check(Ziwei.calc(2026, 2, 17, 0, 'newyear').gzYear === '丙午', '正月初一界：2026-02-17（春节）→ 丙午');

/* ---- 五行局经典案例 ----
 * 1) 王亭之《中州派紫微斗数初级讲义》例：乙未年生人，命宫戊寅 → 土五局
 *    乙未年正月初一 = 1955-01-24，子时 → 命宫在寅，乙年五虎遁寅宫起戊 → 戊寅 → 城头土 → 土五局
 */
{
  const r = Ziwei.calc(1955, 1, 24, 0, 'newyear');
  check(r && r.gzYear === '乙未', '王亭之例：1955-01-24 → 乙未年 (got ' + (r && r.gzYear) + ')');
  check(r && r.mingGong === '戊寅', '王亭之例：命宫戊寅 (got ' + (r && r.mingGong) + ')');
  check(r && r.ju === '土五局', '王亭之例：土五局 (got ' + (r && r.ju) + ')');
}

/* 2) 鸿运风水紫微斗数学院例：1986 丙寅年农历四月午时 → 命宫己亥 → 木三局 */
{
  let found = null;
  for (let dd = 1; dd <= 31; dd++) {
    const lu = Ziwei.solar2lunar(1986, 5, dd);
    if (lu && lu.lMonth === 4) { found = dd; break; }
  }
  check(found !== null, '找到 1986 年农历四月日期 (公历 1986-05-' + found + ')');
  if (found) {
    const r = Ziwei.calc(1986, 5, found, 6, 'newyear'); // 午时 = 6（子0丑1寅2卯3辰4巳5午6）
    check(r && r.gzYear === '丙寅', '鸿运例：年柱丙寅 (got ' + (r && r.gzYear) + ')');
    check(r && r.mingGong === '己亥', '鸿运例：命宫己亥 (got ' + (r && r.mingGong) + ')');
    check(r && r.ju === '木三局', '鸿运例：木三局 (got ' + (r && r.ju) + ')');
  }
}

/* 3) 《明灯易学》五行局表：甲己年 命宫在子 → 水二局
 *    1974 甲寅年农历冬月（十一月）子时 → 命宫在子；甲年寅宫起丙 → 丙子 → 涧下水 → 水二局
 */
{
  let found = null;
  for (let dd = 1; dd <= 31; dd++) {
    const lu = Ziwei.solar2lunar(1974, 12, dd);
    if (lu && lu.lMonth === 11) { found = dd; break; }
  }
  check(found !== null, '找到 1974 年农历冬月日期 (公历 1974-12-' + found + ')');
  if (found) {
    const r = Ziwei.calc(1974, 12, found, 0, 'newyear'); // 子时 = 0
    check(r && r.gzYear === '甲寅', '甲己年例：年柱甲寅 (got ' + (r && r.gzYear) + ')');
    check(r && r.mingGong === '丙子', '甲己年例：命宫丙子 (got ' + (r && r.mingGong) + ')');
    check(r && r.ju === '水二局', '甲己年例：水二局 (got ' + (r && r.ju) + ')');
  }
}

/* ---- 六十甲子纳音完整性 ---- */
{
  const table = Ziwei.juTable();
  const names = ['水二局', '木三局', '金四局', '土五局', '火六局'];
  let total = 0, ok = true;
  names.forEach(function (n) {
    total += table[n].length;
    if (table[n].length !== 12) ok = false;
    console.log('      ' + n + '：' + table[n].join(' '));
  });
  check(ok && total === 60, '五行局表覆盖 60 甲子，每局 12 组 (total=' + total + ')');
}

console.log(failed === 0 ? '\n全部通过 ✓' : '\n存在 ' + failed + ' 项失败 ✗');
process.exitCode = failed === 0 ? 0 : 1;
