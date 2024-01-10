declare function alfredTip(shouldThrow: unknown | (() => unknown), tip: string | ((error: unknown) => string), { displayEl }?: {
    displayEl?: true | ((error: unknown) => HTMLElement);
}): void;
export { alfredTip };
