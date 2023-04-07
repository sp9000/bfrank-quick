import type { DefineComponent, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, ExtractPropTypes, PropType as __PropType } from 'vue';
declare const _sfc_main: DefineComponent<{
    columnWidth: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    items: {
        type: __PropType<unknown[]>;
        required: true;
    };
    gap: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    rtl: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    ssrColumns: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    scrollContainer: {
        type: __PropType<HTMLElement | null | undefined>;
        required: false;
        default: null;
    };
}, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("redraw" | "redrawSkip")[], "redraw" | "redrawSkip", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<ExtractPropTypes<{
    columnWidth: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    items: {
        type: __PropType<unknown[]>;
        required: true;
    };
    gap: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    rtl: {
        type: __PropType<boolean | undefined>;
        required: false;
        default: boolean;
    };
    ssrColumns: {
        type: __PropType<number | undefined>;
        required: false;
        default: number;
    };
    scrollContainer: {
        type: __PropType<HTMLElement | null | undefined>;
        required: false;
        default: null;
    };
}>> & {
    onRedraw?: ((...args: any[]) => any) | undefined;
    onRedrawSkip?: ((...args: any[]) => any) | undefined;
}, {
    columnWidth: number | undefined;
    gap: number | undefined;
    rtl: boolean | undefined;
    ssrColumns: number | undefined;
    scrollContainer: HTMLElement | null | undefined;
}>;
export default _sfc_main;
