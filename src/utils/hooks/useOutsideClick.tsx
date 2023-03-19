import React from "react";

/**
 * A hook that calls a handler function when a click event occurs outside the element
 * referred to by the provided ref.
 *
 * @template T The type of the element being referred to.
 * @param {React.RefObject<T>} ref The ref object that refers to the element being watched.
 * @param {() => void} handler The function to call when a click event occurs outside the element.
 * @returns {void}
 */
export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: () => void
): void {
  React.useEffect(() => {
    /**
     * The function that handles the click event.
     *
     * @param {Event} event The click event object.
     * @returns {void}
     */
    function handleClickOutside(event: Event): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler, ref]);
}
