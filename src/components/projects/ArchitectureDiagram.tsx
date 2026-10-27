import { Fragment } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { Architecture } from "@/lib/types";

/**
 * Layers drawn left to right on wide screens and top to bottom on phones. Built from HTML rather than
 * an image, so the text stays selectable, readable by screen readers and correct in both themes.
 */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const { layers } = architecture;
  return (
    <figure>
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row">
        {layers.map((layer, i) => (
          <Fragment key={layer.label}>
            <li className="flex-1 rounded-lg border border-line p-3">
              <p className="mb-2 text-xs font-medium text-subtle">{layer.label}</p>
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
                {layer.nodes.map((node) => (
                  <li key={node.label}>
                    <p className="text-sm font-medium text-fg">{node.label}</p>
                    <p className="text-xs leading-relaxed text-muted">{node.detail}</p>
                  </li>
                ))}
              </ul>
            </li>
            {i < layers.length - 1 && (
              <li aria-hidden className="flex items-center justify-center text-subtle">
                <ArrowDown className="size-3.5 lg:hidden" />
                <ArrowRight className="hidden size-3.5 lg:block" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs text-subtle">{architecture.caption}</figcaption>
    </figure>
  );
}
