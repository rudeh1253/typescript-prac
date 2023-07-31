// Drag & Drop Interfaces
export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
    // Signal the browser in JavaScript that the thing you
    // are dragging over is a valid drag target.
    // If you don't do the right in the draggOverHandler, dropping
    // will not be possible.
    dragOverHandler(event: DragEvent): void;

    // React to the actual drop that happens. So if the dragOverHandler
    // will permit the drop with the drop handler will handle the drop,
    // and then we can update our data and UI.
    dropHandler(event: DragEvent): void;

    // This method can be helpful when, for example, giving some
    // visual feedback to the user when he or she drags something over
    // the box. For example, changing the background color. If no drop
    // happens, and instead it's canceled or the user moves the element
    // away, we can use the dragLeaveHandler to revert our visual update.
    dragLeaveHandler(event: DragEvent): void;
}