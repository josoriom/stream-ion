interface ResizeHandleProps {
  on_resize: (delta: number) => void;
}

export function ResizeHandle({ on_resize }: ResizeHandleProps) {
  function start(start_x: number) {
    let last_x = start_x;

    function move(event: MouseEvent) {
      on_resize(event.clientX - last_x);
      last_x = event.clientX;
    }

    function stop() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  }

  return (
    <div
      className="resize-handle"
      onMouseDown={(event) => {
        event.preventDefault();
        start(event.clientX);
      }}
    />
  );
}
