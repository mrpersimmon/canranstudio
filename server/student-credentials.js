'use strict';
const { pinyin } = require('pinyin-pro');

// Keep conversion on the server; never send students' names to a remote service.
function suggestPinyin(name) {
  const result = pinyin(name, { toneType: 'none', surname: 'head', separator: '', v: true })
    .toLowerCase().replace(/[\s·.'’-]/g, '');
  return /^[a-z][a-z0-9]{0,119}$/.test(result) ? result : '';
}
function validPinyin(value) { return typeof value === 'string' && /^[a-z][a-z0-9]{0,119}$/.test(value); }
function passwordProblem(password, student) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 64) return '新密码请使用 8–64 位字符';
  if ([student.loginPinyin, student.studentNumber].includes(password.toLowerCase())) return '新密码不能使用姓名拼音或学号';
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password)) return '新密码需要同时包含字母和数字';
  return null;
}
module.exports = { suggestPinyin, validPinyin, passwordProblem };
