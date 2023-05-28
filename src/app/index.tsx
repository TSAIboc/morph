"use client";
import './style.scss';
import { useEffect } from 'react';

import CanvasDraw from '@component/Canvas';
import Controller from '@component/Controller';

const Index = () => {
  useEffect(() => {
    document.oncontextmenu = () => { return false; }
  }, []);

  return (
    <>
      <div className='head'>Simple Mesh Morphing</div>
      <div className='canvas'>
        <div className='slider' />
        <CanvasDraw />
      </div>
      <div className='controller'>
        <Controller />
      </div>
    </>
  )
}

export default Index;