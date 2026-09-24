'use strict';
const {test,expect}=require('@playwright/test');
const {completeUnit78}=require('../support/unit7-8-flow');
test.use({reducedMotion:'reduce',actionTimeout:5000});
test('从词卡开始，浏览16句并完成27题后才获得15星课堂配套证书',async({page})=>{
 test.setTimeout(210000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const recordings=[];await page.route('**/unit7-8/audio/**',route=>{recordings.push(route.request().url());return route.abort();});
 await page.goto('/unit7-8/');await expect(page).toHaveTitle('新朋友采访站 · Lesson 7–8');
 await page.getByRole('button',{name:'开始冒险',exact:true}).click();await expect(page).toHaveURL(/#learn\/words$/);
 const words=page.locator('.stage-words');await expect(words.getByRole('button',{name:'Italian',exact:true})).toContainText('/ɪˈtæljən/');
 await page.goto('/unit7-8/#learn/certificate');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
 await completeUnit78(page);
 await page.getByRole('textbox',{name:'证书上的名字',exact:true}).fill('好奇的小记者');await page.getByRole('button',{name:'领取单元证书',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'新朋友采访站纪念',exact:true});await expect(dialog.locator('#certificateName')).toHaveText('好奇的小记者');
 for(const person of ['Robert','Sophie'])await expect(dialog.getByRole('img',{name:person,exact:true})).toBeVisible();
 const day=await dialog.locator('#certificateDate').innerText();await dialog.screenshot({path:'output/playwright/unit7-8/certificate-desktop.png'});
 const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'保存图片',exact:true}).click();await(await download).saveAs('output/playwright/unit7-8/certificate-saved.png');
 const pdf=await page.pdf({path:'output/playwright/unit7-8/certificate-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
 await page.keyboard.press('Escape');await page.reload();await page.getByRole('button',{name:'领取单元证书',exact:true}).click();await expect(dialog.locator('#certificateDate')).toHaveText(day);await page.keyboard.press('Escape');
 for(const other of ['unit1-2','unit3-4','unit5-6','unit49-50']){await page.goto('/'+other+'/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('0');}
 expect(errors).toEqual([]);expect(recordings).toEqual([]);
});

test('首页新增采访站，lesson 子目录独立继续，返回同地址仍定位当前活动',async({page})=>{
 const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});await page.goto('/lesson/');await page.getByRole('link',{name:'开始学习：新朋友采访站',exact:true}).click();await expect(page).toHaveURL(/\/lesson\/unit7-8\/#learn\/words$/);
 await page.getByRole('link',{name:'问答有办法',exact:true}).click();const room=page.locator('.stage-be');await room.getByRole('button',{name:'is / am',exact:true}).click();await page.locator('#startBtn').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'继续冒险',exact:true}).click();await expect(room.getByRole('heading').first()).toBeInViewport();
 await page.getByRole('link',{name:'我的课程',exact:true}).click();await expect(page.getByRole('link',{name:'继续学习：新朋友采访站',exact:true})).toHaveAttribute('href','/lesson/unit7-8/#learn/be');await expect(page.getByRole('link',{name:'开始学习：新朋友见面会',exact:true})).toBeVisible();await page.getByRole('link',{name:'继续学习：新朋友采访站',exact:true}).click();await expect(room.getByRole('button',{name:'is / am',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/unit7-8/#learn/be');await expect(room.getByRole('button',{name:'is / am',exact:true})).toHaveAttribute('aria-pressed','false');expect(failed).toEqual([]);
});

test('纸笔练习保留 Written A 三组与 B 十组，明确人物并实际打印一张 A4',async({page})=>{
 await page.goto('/unit7-8/#learn/certificate');await page.getByText('和朋友再试试',{exact:true}).click();await expect(page.locator('.reference-writing li')).toHaveText(['My name ___ Robert. I ___ a student. I ___ Italian.','Sophie ___ not Italian. She ___ French.','Mr. Blake ___ my teacher. He ___ not French.']);await expect(page.locator('.reply-writing li>span:first-child')).toHaveText(['policeman · he','policewoman · she','taxi driver · he','air hostess · she','postman · he','nurse · she','mechanic · he','hairdresser · he','housewife · she','milkman · he']);await page.evaluate(()=>{window.print=()=>{};});await page.getByRole('button',{name:'打印练习纸',exact:true}).click();await page.emulateMedia({media:'print',reducedMotion:'reduce'});
 for(const row of await page.locator('.reply-writing li').all()){await expect(row).toBeVisible();await expect(row.locator('.writing-rule')).toHaveCount(2);expect(await row.evaluate(el=>[...el.querySelectorAll('.writing-rule')].every(line=>line.getBoundingClientRect().height>=19&&line.clientWidth>=el.clientWidth*.9))).toBe(true);}
 const pdf=await page.pdf({path:'output/playwright/unit7-8/writing-print.pdf',preferCSSPageSize:true,printBackground:true});expect(pdf.toString('latin1').match(/\/Type \/Page\b/g)).toHaveLength(1);
});

test('挑战暂停保留选择，记录区分独立、提示和修正；不提前发证',async({page})=>{
 test.setTimeout(45000);await page.goto('/unit7-8/#learn/exam');const room=page.locator('.stage-exam'),check=room.getByRole('button',{name:'检查答案',exact:true});await room.getByRole('button',{name:'法国人；护士',exact:true}).click();await expect(check).toBeEnabled({timeout:10000});await check.click();await expect(room.getByRole('status')).toHaveText('再看看，试一次。');await room.getByRole('button',{name:'再试一次',exact:true}).click();await room.getByRole('button',{name:'意大利人；护士',exact:true}).click();await expect(check).toBeEnabled({timeout:10000});await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();
 await room.getByRole('button',{name:'给点线索',exact:true}).click();await room.getByRole('button',{name:'Are you a mechanic?',exact:true}).click();await room.getByRole('button',{name:'暂停，稍后继续',exact:true}).click();await page.reload();await room.getByRole('button',{name:'继续挑战',exact:true}).click();await expect(room.getByRole('button',{name:'Are you a mechanic?',exact:true})).toHaveAttribute('aria-pressed','true');await check.click();await room.getByRole('button',{name:'下一题',exact:true}).click();for(const token of ['My',"name's",'Ben.',"I'm",'an engineer.'])await room.getByRole('group',{name:'待选词块',exact:true}).getByRole('button',{name:token,exact:true}).click();await check.click();await room.getByRole('button',{name:'查看本次记录',exact:true}).click();await expect(room).toContainText('首次独立答对 1 / 3');await expect(room).toContainText('提示后完成 1 题 · 修正后完成 1 题');await page.goto('/unit7-8/#learn/certificate');await expect(page.locator('#starCount')).toHaveText('3');await expect(page.getByRole('button',{name:'领取单元证书',exact:true})).toBeDisabled();
});

test('内容升版只失效被改活动，未改活动的选择仍保留',async({page})=>{
 await page.goto('/unit7-8/#learn/reply');const reply=page.locator('.stage-reply');await reply.getByRole('button',{name:"I'm Italian.",exact:true}).click();await reply.getByRole('button',{name:'检查答案',exact:true}).click();await page.goto('/unit7-8/#learn/be');const be=page.locator('.stage-be');await be.getByRole('button',{name:'is / am',exact:true}).click();await page.route('**/unit7-8/content.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace("q('reply-nationality'","q('reply-nationality-revised'")});});await page.reload();await expect(be.getByRole('button',{name:'is / am',exact:true})).toHaveAttribute('aria-pressed','true');await page.goto('/unit7-8/#learn/reply');await expect(reply.getByRole('button',{name:"I'm Italian.",exact:true})).toHaveAttribute('aria-pressed','false');await expect(reply.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');await expect(reply.getByRole('button',{name:'检查答案',exact:true})).toBeDisabled();
});

test('首页重开包含新单元，取消保留、确认仅清除 lesson 路径记录',async({page})=>{
 await page.goto('/unit7-8/#learn/be');const root=page.locator('.stage-be');await root.getByRole('button',{name:'is / am',exact:true}).click();for(const path of ['unit1-2/#learn/ask','unit3-4/#learn/reply','unit5-6/#learn/refer','unit7-8/#learn/be','unit49-50/#learn/give']){await page.goto('/lesson/'+path);await expect(page.locator('.stage-'+path.split('#learn/')[1])).toBeVisible();}await page.goto('/lesson/');await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();await page.getByRole('button',{name:'继续确认',exact:true}).click();await page.getByRole('button',{name:'取消重开',exact:true}).click();await page.getByRole('button',{name:'返回课程',exact:true}).click();await expect(page.getByRole('link',{name:'继续学习：新朋友采访站',exact:true})).toBeVisible();await page.getByRole('button',{name:'设备冒险设置',exact:true}).click();await page.getByRole('button',{name:'重开冒险',exact:true}).click();await page.getByRole('button',{name:'继续确认',exact:true}).click();await page.getByRole('button',{name:'确认重开',exact:true}).click();for(const name of ['礼貌小帮手','雨伞认领小帮手','新朋友见面会','新朋友采访站'])await expect(page.getByRole('link',{name:'开始学习：'+name,exact:true})).toBeVisible();await page.goto('/unit7-8/#learn/be');await expect(root.getByRole('button',{name:'is / am',exact:true})).toHaveAttribute('aria-pressed','true');
});
