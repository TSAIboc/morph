import './index.scss'
import Canvas from './Canvas';

import useEditor from '@useHook/useEditor';
import useMorph from '@useHook/useMorph';;

const CanvasDraw: React.FC = () => {
    const editor = useEditor('window1');
    let isLoaded = useMorph(editor, `/assets/gltf/LeePerrySmith.glb`);

    return (
        <>
            {isLoaded ? <></> : <div className='loading' />}
            <Canvas
                id={'window1'}
                editor={editor}
            />
        </>
    )

}

export default CanvasDraw;