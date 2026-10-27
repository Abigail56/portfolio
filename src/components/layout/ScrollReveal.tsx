import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Fades in elements marked with `data-reveal` as they scroll into view. The hidden starting state only
 * applies once JavaScript is running and the visitor hasn't asked for reduced motion (see globals.css),
 * so content is never lost if this doesn't run.
 */
export function ScrollReveal() {
  const { asPath } = useRouter();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [asPath]);

  return null;
}
