import './index.scss';
import React from 'react';
import { useDispatch } from 'react-redux';
import { viewangleChanged } from '@feature/viewangleSlice';
import { resetChanged } from '@feature/controllerSlice';
const Viewangle: React.FC = () => {
    const dispatch = useDispatch();
    const viewChanged = (e: React.MouseEvent<HTMLElement>) => {
        dispatch(viewangleChanged((e.target as HTMLElement).id));
    }
    const reset = (e: React.MouseEvent<HTMLElement>) => {
        dispatch(resetChanged());
    }
    return (
        <>
            <div id='front' className='front' onClick={viewChanged} />
            <div id='right' className='right' onClick={viewChanged} />
            <div id='reset' className='reset' onClick={reset} />
        </>
    )

}

export default Viewangle;