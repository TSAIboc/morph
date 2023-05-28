import { Object3D } from 'three';
import { useEffect, useMemo, useState } from 'react';
import { Editor3D } from '@type/index';

import MorphAction from '@utility/morph/Morph';
import Scenes from '@utility/morph/Scenes';

import { useSelector } from 'react-redux';
import { controllerSeletor } from '@feature/controllerSlice';
import { viewangleSelector } from '@feature/viewangleSlice';

import { setViewangle } from '@utility/3d/viewsAngle';

const useMorph = (editor: Editor3D, path: string) => {

    const [morphModel, setMorphModel] = useState<Object3D | null>(null);
    const [scenes, setScenes] = useState<Scenes | null>(null);

    const morph: MorphAction = useMemo(() => {
        return new MorphAction();
    }, []);

    const controllerState = useSelector(controllerSeletor) as { size: number, intensity: number, isButtonClick: boolean };
    const viewangleState = useSelector(viewangleSelector) as { view: string, isButtonClick: boolean };

    useEffect(() => {
        if (morph) {
            morph.setEnvironment(editor);
            morph.load(path, setMorphModel);
        }
    }, [editor])

    useEffect(() => {
        const slider = document.querySelector('.slider');
        if (morphModel && slider)
            setScenes(new Scenes(editor, slider, morph));
    }, [morphModel]);

    useEffect(() => {
        if (morph)
            morph.sizeChanged(controllerState.size);
    }, [controllerState.size])

    useEffect(() => {
        if (morph)
            morph.intensityChanged(controllerState.intensity);
    }, [controllerState.intensity])

    useEffect(() => {
        if (morph)
            morph.resetChanged();
    }, [controllerState.isButtonClick])

    useEffect(() => {
        if (editor && scenes) {
            const { camera, control, cameraDistance } = editor;
            setViewangle(viewangleState.view, control, camera, cameraDistance, scenes.controlChanged);
        }
    }, [viewangleState.isButtonClick])

    return morphModel ? true : false;
}

export default useMorph;