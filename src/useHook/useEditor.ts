import Editor from '@utility/3d/editor';
import { useMemo } from 'react';
const useEditor = (key: string) => {
    const editor: Editor = useMemo(() => {
        return new Editor(key);
    }, [])
    return editor;
}

export default useEditor;