"use client";
import React, { useEffect, useRef } from "react";
import { Editor3D } from '@type/index';

const Canvas = (props: { id: string, editor: Editor3D }) => {
    const { id, editor } = props;
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (editor) {
            editor.initialize(ref.current);
            return () => {
                editor.remove();
            }
        }
    }, [editor])
    return (
        <div
            id={id}
            style={{ width: '100%', height: '100%', }}
            ref={ref}
        />
    );
}
export default Canvas;