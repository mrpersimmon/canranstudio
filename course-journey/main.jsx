import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {App} from './App';
import {Workspace} from '../student-ui/Workspace';
import './styles.css';

window.CanranCourseJourney={
  mount(target,options){
    const root=createRoot(target);
    document.body.classList.add('journey-page');
    if(!options.who.preview){document.body.classList.add('student-workspace-page');document.documentElement.classList.add('student-workspace-root');}
    flushSync(()=>root.render(options.who.preview?<App {...options}/>:<Workspace {...options}/>));
    return()=>{root.unmount();document.body.classList.remove('journey-page','student-workspace-page');document.documentElement.classList.remove('student-workspace-root');};
  }
};
