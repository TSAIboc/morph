import { Editor3D } from '@type/index';
import MorphAction from '@utility/morph/Morph';
class SceneSlider {
    private _editor: Editor3D | null;
    private _element: Element | null;
    private _sliderPosition: number;
    private _morph: MorphAction | null | undefined;
    private _ratio: number;
    constructor(editor: Editor3D, slider: Element, morph?: MorphAction | null | undefined) {

        this._editor = editor;
        this._morph = morph;
        this._element = slider;
        this._sliderPosition = 0;
        this._ratio = 0.5;

        this._addEvent();
        this._initialize();
    }

    _initialize = () => {
        if (this._editor) {
            if (this._editor.container)
                this._sliderPosition = this._editor.container.clientWidth * 0.5;
        }
    }

    get position() {
        return this._sliderPosition;
    }

    _addEvent = () => {
        if (!this._element) return;
        (this._element as HTMLElement).style.touchAction = 'none'; // disable touch scroll
        (this._element as HTMLElement).addEventListener('pointerdown', this._onPointerDown);
        window.addEventListener('resize', this._windowResize);
    }

    _onPointerDown = (e: PointerEvent) => {
        if (e.isPrimary === false) return;
        if (e.button != 0) return;
        if (!this._editor) return;
        const { control } = this._editor;
        if (control)
            control.enabled = false;
        if (this._morph) {
            this._morph.enabled = false;
            if (this._morph.morphControl) {
                this._morph.morphControl.enabled = false;
                this._morph.morphControl._generateBrush().nonvisible();
            }
        }

        window.addEventListener('pointermove', this._onPointerMove);
        window.addEventListener('pointerup', this._onPointerUp);
    }

    _onPointerUp = () => {
        if (!this._editor) return;
        const { control } = this._editor;
        if (control)
            control.enabled = true;
        if (this._morph) {
            this._morph.enabled = true;
            if (this._morph.morphControl)
                this._morph.morphControl.enabled = true;
        }
        window.removeEventListener('pointermove', this._onPointerMove);
        window.removeEventListener('pointerup', this._onPointerUp);
    }

    _onPointerMove = (e: PointerEvent) => {
        if (e.isPrimary === false) return;
        if (!this._editor) return;
        if (!this._element) return;
        const { container } = this._editor;
        if (!container) return;
        this._sliderPosition = Math.max(0, Math.min(container.clientWidth, e.pageX));
        (this._element as HTMLElement).style.left = this._sliderPosition - ((this._element as HTMLElement).offsetWidth / 2) + 'px';
        this._ratio = this._sliderPosition / container.offsetWidth;
    }

    _windowResize = () => {
        if (!this._editor) return;
        if (!this._element) return;
        const { container } = this._editor;
        if (!container) return;
        let newPosition = container.clientWidth * this._ratio;
        this._sliderPosition = newPosition;
        (this._element as HTMLElement).style.left = this._sliderPosition - ((this._element as HTMLElement).offsetWidth / 2) + 'px';
    }

}
export default SceneSlider;