import './index.scss'
import React from 'react';
import Viewangle from '@component/Viewangle';
import { Slider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { sizeChanged, intensityChanged, controllerSeletor } from '@feature/controllerSlice';
const Controller: React.FC = () => {
    const dispatch = useDispatch();
    const state = useSelector(controllerSeletor) as { size: number, intensity: number };
    const onSizeChange = (value: number) => {
        dispatch(sizeChanged(value));
    }
    const onIntensityChange = (value: number) => {
        dispatch(intensityChanged(value));
    }

    return (
        <section className='menu'>
            <div className='viewangle'>
                <Viewangle />
            </div>
            <div className='size'>
                <div className='text'> size </div>
                <div className='control'>
                    <Slider
                        min={1}
                        max={4}
                        defaultValue={state.size}
                        onChange={onSizeChange}
                    />
                </div>
            </div>
            <div className='intensity'>
                <div className='text'> intensity </div>
                <div className='control'>
                    <Slider
                        min={1}
                        max={4}
                        defaultValue={state.intensity}
                        onAfterChange={onIntensityChange}
                    />
                </div>
            </div>
        </section>
    )
}

export default Controller;