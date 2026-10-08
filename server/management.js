'use strict';
const learning = require('./learning');
const { UNITS } = require('./catalog');
const { suggestPinyin, validPinyin } = require('./student-credentials');
const fail = (status, message) => Object.assign(Error(message), { status });
const name = value => typeof value === 'string' && value.trim() && value.trim().length <= 60 ? value.trim() : (() => { throw fail(400, '名称请填写 1–60 个字'); })();
const ids = values => {
  if (!Array.isArray(values) || !values.length || values.length > 1000 || values.some(id => typeof id !== 'string') || new Set(values).size !== values.length) throw fail(400, '请选择 1–1000 位不同的学生');
  return values;
};
function createManagement({ store, cookie, definitions, descriptions, origin, basePath }) {
  function authenticate(request, allowSetup = false, required = true) {
    const raw = cookie(request, 'admin'), now = Date.now();
    const admin = store.lookupSession(raw, 'admin', now);
    if (admin) return { auth: admin, role: 'admin', classIds: null, identity: { role: 'admin', name: admin.subject } };
    const auth = store.lookupSession(raw, 'teacher', now) || store.lookupSession(raw, 'teacher-setup', now);
    if (!auth) {
      if (!required) return null;
      throw fail(store.lookupSession(cookie(request, 'student'), 'student', now) ? 403 : 401, '请先登录管理页');
    }
    const teacher = store.teachers.get(auth.subject);
    if (!allowSetup && teacher.mustChangePassword) { if (!required) return null; throw fail(403, '请先设置新密码'); }
    return { auth, role: 'teacher', classIds: store.teachers.classIds(teacher.id), teacher, identity: { role: 'teacher', name: teacher.name, teacherNumber: teacher.teacherNumber, mustChangePassword: teacher.mustChangePassword } };
  }
  function administrator(who) { if (who.role !== 'admin') throw fail(403, '只有管理员可以进行此操作'); }
  function group(who, id) {
    if (who.classIds && !who.classIds.includes(id)) throw fail(403, '你没有这个班级的管理权限，请联系管理员');
    const row = store.classes().find(c => c.id === id);
    if (!row) throw fail(404, '班级不存在');
    return row;
  }
  function student(who, id) {
    if (typeof id !== 'string') throw fail(400, '请选择学生');
    const row = store.student(id);
    if (!row) throw fail(404, '学生不存在');
    group(who, row.classId);
    return row;
  }
  const classes = who => store.classes().filter(c => !who.classIds || who.classIds.includes(c.id));
  const audit = (who, action, target, details) => store.teachers.audit(who.auth, action, target, details);
  async function handle(request, url, relative, input) {
    const who = authenticate(request, relative === 'api/admin/state');
    if (relative === 'api/admin/state' && !input) {
      if (who.teacher?.mustChangePassword) return { identity: who.identity, classes: [], students: [], courses: [], classTeachers: {} };
      const visible = classes(who), teachers = store.teachers.list();
      return { identity: who.identity, classes: visible, students: store.students().filter(s => !who.classIds || who.classIds.includes(s.classId)), courses: descriptions,
        classTeachers: Object.fromEntries(visible.map(c => [c.id, teachers.filter(t => t.classIds.includes(c.id)).map(t => ({ id: t.id, name: t.name, teacherNumber: t.teacherNumber, active: t.active }))])) };
    }
    if (relative === 'api/admin/teachers' && !input) { administrator(who); return { teachers: store.teachers.list(), classes: store.classes() }; }
    if (relative === 'api/admin/teacher-preview' && input) { administrator(who); const value = name(input.name); return { name: value, pinyin: suggestPinyin(value) }; }
    if (relative === 'api/admin/teachers' && input) {
      administrator(who);
      const teacher = input.id ? store.teachers.update(input, who.auth) : store.teachers.create(input, who.auth);
      return { teacher, ...(input.id ? {} : { credential: store.teachers.credential(teacher.id) }) };
    }
    if (relative === 'api/admin/teacher-account' && input) {
      administrator(who); const teacher = store.teachers.get(input.teacherId);
      if (!teacher) throw fail(404, '老师不存在');
      return { teacher, credential: store.teachers.credential(teacher.id) };
    }
    if (relative === 'api/admin/teacher-reset-password' && input) {
      administrator(who); const teacher = store.teachers.reset(input.teacherId, input.revision, who.auth);
      return { teacher, credential: store.teachers.credential(teacher.id) };
    }
    if (relative === 'api/admin/class-teachers' && input) {
      administrator(who); store.teachers.assignClass(input.classId, input.teacherIds, input.expectedIds, who.auth); return { ok: true };
    }
    if (relative === 'api/admin/learning' && !input) {
      const filters = { ...Object.fromEntries(url.searchParams), status: url.searchParams.getAll('status').join(','), classIds: who.classIds };
      if (filters.q?.length > 100 || (filters.course && !UNITS.includes(filters.course)) || !learning.selectedStatuses(filters.status) || (filters.sort && !learning.sorts.includes(filters.sort))) throw fail(400, '查询条件不正确');
      if (filters.classId) group(who, filters.classId);
      return learning.dashboard(store.learning.read(filters), definitions, descriptions, filters);
    }
    const learningRoute = relative.match(/^api\/admin\/students\/([^/]+)\/learning(?:\/(unit\d+-\d+))?$/);
    if (learningRoute && !input) {
      const row = student(who, learningRoute[1]), dataset = store.learning.read({ studentId: row.id, classIds: who.classIds });
      const view = learning.studentView(dataset.students[0], dataset, definitions, descriptions);
      if (learningRoute[2]) {
        const course = view.courses.find(c => c.id === learningRoute[2]);
        if (!course) throw fail(404, '没有这门课程的学习记录或开放权限');
        return { student: view.student, course: learning.courseRecord(course) };
      }
      return learning.studentReport(view);
    }
    if (relative === 'api/admin/student-preview' && input) {
      const names = String(input.names || '').split('\n').filter(value => value.trim()).map(name);
      if (!names.length || names.length > 100) throw fail(400, '每次填写 1–100 位学生');
      return { students: names.map(name => ({ name, pinyin: suggestPinyin(name) })) };
    }
    if (relative === 'api/admin/classes' && input) {
      if (input.id) {
        const prior = group(who, input.id);
        if (input.name === undefined && input.courses === undefined) throw fail(400, '请填写班级名称或选择开放课程');
        // Compare only the edited field; renaming and opening courses are independent.
        if ((input.name !== undefined && input.expectedName !== undefined && input.expectedName !== prior.name) ||
            (input.courses !== undefined && input.expectedCourses !== undefined && (!Array.isArray(input.expectedCourses) || [...input.expectedCourses].sort().join(',') !== [...prior.courses].sort().join(',')))) throw fail(409, '这项班级设置已被更新，请刷新后核对再保存');
        if (who.role === 'teacher' && ((input.name !== undefined && input.expectedName === undefined) || (input.courses !== undefined && input.expectedCourses === undefined))) throw fail(409, '请刷新班级设置后再保存');
        const newName = input.name === undefined ? prior.name : name(input.name), courses = input.courses === undefined ? prior.courses : input.courses;
        if (!Array.isArray(courses) || courses.some(id => !UNITS.includes(id))) throw fail(400, '只能开放现行教学单元');
        store.updateClass(prior.id, newName, courses);
        audit(who, 'class.update', prior.id, { before: { name: prior.name, courses: prior.courses }, after: { name: newName, courses } });
        return { ok: true, class: { id: prior.id, name: newName, courses: [...new Set(courses)] } };
      }
      administrator(who); const created = store.createClass(name(input.name)); audit(who, 'class.create', created.id, { name: created.name }); return created;
    }
    if (relative === 'api/admin/students' && input) {
      group(who, input.classId);
      if (input.id) {
        const prior = student(who, input.id);
        store.updateStudent(input.id, name(input.name), input.classId, input.active === true);
        audit(who, 'student.update', input.id, { before: { name: prior.name, classId: prior.classId, active: !!prior.active }, after: { name: name(input.name), classId: input.classId, active: input.active === true } });
        return { ok: true };
      }
      if (!Array.isArray(input.students) || !input.students.length || input.students.length > 100) throw fail(400, '每次填写 1–100 位学生，并核对姓名拼音');
      const rows = input.students.map(row => ({ name: name(row.name), pinyin: row.pinyin }));
      if (rows.some(row => !validPinyin(row.pinyin))) throw fail(400, '姓名拼音请用小写字母，不加空格和声调；ü 用 v');
      const students = store.createStudents(rows, input.classId); audit(who, 'student.create', input.classId, { studentIds: students.map(s => s.id) }); return { students };
    }
    if (relative === 'api/admin/accounts' && input) {
      if (input.studentIds !== undefined) ids(input.studentIds).forEach(id => student(who, id));
      else if (input.studentId) student(who, input.studentId);
      else group(who, input.classId);
      const selected = store.students().filter(s => input.studentIds ? input.studentIds.includes(s.id) : input.studentId ? s.id === input.studentId : s.classId === input.classId);
      if (!selected.length) throw fail(404, '没有找到学生');
      return { accounts: selected.map(s => ({ ...s, ...store.initialCredential(s.id), className: group(who, s.classId).name, url: origin + basePath })) };
    }
    if (relative === 'api/admin/reset-password' && input) {
      student(who, input.studentId);
      if (!validPinyin(input.pinyin)) throw fail(400, '请核对姓名拼音，用小写字母，不加空格和声调；ü 用 v');
      store.resetPassword(input.studentId, input.pinyin); audit(who, 'student.reset-password', input.studentId); return { ok: true };
    }
    if (relative === 'api/admin/reset-passwords' && input) {
      const selected = ids(input.studentIds); selected.forEach(id => student(who, id));
      const count = await store.resetPasswords(selected, () => {
        const current = authenticate(request); selected.forEach(id => student(current, id));
        audit(current, 'student.reset-passwords', 'batch', { studentIds: selected });
      });
      return { ok: true, count };
    }
    throw fail(404, '管理操作不存在');
  }
  return { authenticate, group, handle, courses: who => who.role === 'admin' ? UNITS : [...new Set(classes(who).flatMap(c => c.courses))] };
}
module.exports = { createManagement };
