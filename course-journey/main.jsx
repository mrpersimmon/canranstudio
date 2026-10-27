import React from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {App} from './App';
import './styles.css';

window.CanranCourseJourney={
  mount(target,options){
    const root=createRoot(target);
    document.body.classList.add('journey-page');
    flushSync(()=>root.render(<App {...options}/>));
    return()=>{root.unmount();document.body.classList.remove('journey-page');};
  }
};
