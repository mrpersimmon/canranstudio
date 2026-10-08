'use strict';
// Separate from progress.value: submitted work is observable, never resumable.
function learningStore(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS learning_students(student TEXT PRIMARY KEY REFERENCES students(id),observedFrom INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS learning_availability(classId TEXT NOT NULL REFERENCES classes(id),course TEXT NOT NULL,availableSince INTEGER NOT NULL,closedAt INTEGER,PRIMARY KEY(classId,course));
    CREATE TABLE IF NOT EXISTS learning_courses(student TEXT NOT NULL REFERENCES students(id),course TEXT NOT NULL,generation INTEGER NOT NULL,enteredAt INTEGER,lastRecordAt INTEGER,lastProgressAt INTEGER,resetAt INTEGER,PRIMARY KEY(student,course));
    CREATE TABLE IF NOT EXISTS learning_submissions(student TEXT NOT NULL REFERENCES students(id),course TEXT NOT NULL,generation INTEGER NOT NULL,revision TEXT NOT NULL,activity TEXT NOT NULL,run TEXT NOT NULL,question TEXT NOT NULL,attempts INTEGER NOT NULL,correct INTEGER NOT NULL,firstCorrect INTEGER NOT NULL,receivedAt INTEGER NOT NULL,PRIMARY KEY(student,course,generation,revision,activity,run,question));
  `);
  const now=Date.now();
  db.prepare('INSERT OR IGNORE INTO learning_students SELECT id,? FROM students').run(now);
  const assigned=db.prepare('INSERT OR IGNORE INTO learning_availability(classId,course,availableSince) VALUES (?,?,?)');
  for(const c of db.prepare('SELECT id,courses FROM classes').all())for(const course of JSON.parse(c.courses))assigned.run(c.id,course,now);
  const hasAwards=Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='unit_awards'").get());
  const runRow=db.prepare('SELECT attempts,correct,firstCorrect FROM learning_submissions WHERE student=? AND course=? AND generation=? AND revision=? AND activity=? AND run=? AND question=?');
  const answered=db.prepare('SELECT MAX(correct) AS correct FROM learning_submissions WHERE student=? AND course=? AND generation=? AND revision=? AND activity=? AND question=?');
  const put=db.prepare('INSERT INTO learning_submissions VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(student,course,generation,revision,activity,run,question) DO UPDATE SET attempts=excluded.attempts,correct=MAX(correct,excluded.correct),receivedAt=excluded.receivedAt');
  return {
    student(who,now=Date.now()){db.prepare('INSERT OR IGNORE INTO learning_students VALUES (?,?)').run(who,now);},
    reassigned(who,now=Date.now()){db.prepare('UPDATE learning_students SET observedFrom=? WHERE student=?').run(now,who);},
    courses(classId,courses,now=Date.now()){
      for(const row of db.prepare('SELECT course FROM learning_availability WHERE classId=?').all(classId))if(!courses.includes(row.course))db.prepare('UPDATE learning_availability SET closedAt=COALESCE(closedAt,?) WHERE classId=? AND course=?').run(now,classId,row.course);
      for(const course of courses){assigned.run(classId,course,now);db.prepare('UPDATE learning_availability SET availableSince=?,closedAt=NULL WHERE classId=? AND course=? AND closedAt IS NOT NULL').run(now,classId,course);}
    },
    enter(who,course,generation,now=Date.now()){
      db.prepare('INSERT INTO learning_courses(student,course,generation,enteredAt) VALUES (?,?,?,?) ON CONFLICT(student,course) DO UPDATE SET enteredAt=COALESCE(enteredAt,excluded.enteredAt)').run(who,course,generation,now);
    },
    sync(who,course,generation,records,advanced,now=Date.now()){
      let changed=false,meaningful=advanced;
      for(const r of records){
        const args=[who,course,generation,r.revision,r.activity,r.run,r.question],prior=runRow.get(...args);
        if(prior&&(prior.attempts>=r.attempts||prior.firstCorrect!==r.firstCorrect))continue;
        const old=answered.get(who,course,generation,r.revision,r.activity,r.question);
        if(!r.knownComplete&&(old.correct===null||(!old.correct&&r.correct)))meaningful=true;
        put.run(...args,r.attempts,r.correct,r.firstCorrect,now);changed=true;
      }
      if(changed||advanced)db.prepare('INSERT INTO learning_courses(student,course,generation,lastRecordAt,lastProgressAt) VALUES (?,?,?,?,?) ON CONFLICT(student,course) DO UPDATE SET lastRecordAt=excluded.lastRecordAt,lastProgressAt=COALESCE(excluded.lastProgressAt,lastProgressAt)').run(who,course,generation,now,meaningful?now:null);
      return {received:changed||advanced,advanced:meaningful};
    },
    reset(who,course,generation,now=Date.now()){
      // Prior generations remain available for history; only the current generation is summarized.
      db.prepare('INSERT INTO learning_courses VALUES (?,?,?,?,NULL,NULL,?) ON CONFLICT(student,course) DO UPDATE SET generation=excluded.generation,enteredAt=excluded.enteredAt,lastRecordAt=NULL,lastProgressAt=NULL,resetAt=excluded.resetAt').run(who,course,generation,null,now);
    },
    award(who,course,edition){return hasAwards?JSON.parse(db.prepare('SELECT value FROM unit_awards WHERE student=? AND course=? AND edition=?').get(who,course,edition)?.value||'null'):null;},
    read({studentId='',classId='',q='',active='active'}={}){
      const where=[],args=[];
      if(studentId){where.push('s.id=?');args.push(studentId);}else{
        if(classId){where.push('s.classId=?');args.push(classId);}
        if(q){where.push('(instr(lower(s.name),lower(?))>0 OR instr(s.studentNumber,lower(?))>0)');args.push(q,q);}
        if(active!=='all'){where.push('s.active=?');args.push(active==='disabled'?0:1);}
      }
      const filter=where.length?' WHERE '+where.join(' AND '):'';
      const rows=(select,join='')=>db.prepare(select+' FROM students s '+join+filter).all(...args);
      return {
        students:rows('SELECT s.id,s.name,s.studentNumber,s.classId,s.active,l.observedFrom','JOIN learning_students l ON l.student=s.id'),
        classes:db.prepare('SELECT * FROM classes ORDER BY rowid').all().map(r=>({...r,courses:JSON.parse(r.courses)})),
        availability:db.prepare('SELECT * FROM learning_availability').all(),
        progress:rows('SELECT p.*','JOIN progress p ON p.student=s.id').map(r=>({...r,value:JSON.parse(r.value)})),
        meta:rows('SELECT p.*','JOIN learning_courses p ON p.student=s.id'),
        observations:db.prepare('SELECT p.student,p.course,p.generation,p.revision,p.activity,p.question,MAX(p.correct) AS correct,MAX(p.receivedAt) AS receivedAt FROM students s JOIN learning_submissions p ON p.student=s.id'+filter+' GROUP BY p.student,p.course,p.generation,p.revision,p.activity,p.question').all(...args),
        awards:hasAwards?rows('SELECT p.*','JOIN unit_awards p ON p.student=s.id').map(r=>({...r,value:JSON.parse(r.value)})):[]
      };
    }
  };
}
module.exports={learningStore};
