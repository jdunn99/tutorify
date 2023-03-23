import { api } from "@/utils/api";
import { useClickOutside } from "@/utils/hooks/useOutsideClick";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { MdSearch } from "react-icons/md";
import { Button } from "./button";
import { Input } from "./input";
import { Spinner } from "./loading";

/**
 * Creates a debounced function that delays invoking the given function until after `delay` milliseconds have elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A debounced function.
 */
function debounce(func: Function, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | null;

  return function debounced(...args: any[]) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
      timerId = null;
    }, delay);
  };
}

/**
 * A component for searching using an input field, a button, and an autocomplete dropdown
 */
export function Search() {
  const router = useRouter();

  const searchResultsRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState<boolean>(false);

  const [query, setQuery] = React.useState<string>("");
  const { data: autocomplete, isLoading } = api.subject.autocomplete.useQuery(
    { query },
    { enabled: query.length > 1 }
  );

  useClickOutside(searchResultsRef, () => setFocused(false));

  /**
   * Handles the change event for the search input.
   * Uses a debounce so that api calls aren't made too often.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
   */
  const onChangeDebounced = React.useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
      }, 500),
    []
  );

  /**
   * Handles the submit event for the search form.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The event object.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.length < 1) return;

    router.push(`/search?query=${query}`);
  }

  return (
    <div className="relative" ref={searchResultsRef}>
      <form className={`flex justify-center w-96 `} onSubmit={onSubmit}>
        <Input
          type="text"
          className="flex-1 rounded-r-none  focus:outline-none"
          placeholder="Search"
          onFocus={() => setFocused(true)}
          onChange={onChangeDebounced}
        />
        <Button className="rounded-l-none px-8" type="submit">
          <MdSearch />
        </Button>
      </form>

      {query.length > 2 && focused ? (
        <div className="absolute text-left top-14 left-0 right-0 overflow-y-auto bg-white z-50 rounded shadow-sm border border-slate-200">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
            </div>
          ) : autocomplete && autocomplete.length > 0 ? (
            autocomplete?.map(({ name }) => (
              <Link
                key={name}
                className="block cursor-pointer hover:bg-sky-50 p-4"
                href={`/search?query=${name}`}
              >
                {name}
              </Link>
            ))
          ) : (
            <p className='p-4'>No results found. </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
