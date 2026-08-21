import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

// Предлоги и короткие союзы, которые не должны оставаться в конце строки.
const nonbreakingWords = [
  "а", "без", "бы", "в", "во", "для", "до", "за", "и", "из", "или", "к", "ко",
  "ли", "на", "не", "ни", "но", "о", "об", "обо", "от", "по", "под", "при", "про",
  "с", "со", "у", "через",
].join("|");

const widowPattern = new RegExp(`(^|[\\s\\u00A0])(${nonbreakingWords})[ \\t]+`, "giu");
const ignoredTags = new Set(["code", "pre", "script", "style", "textarea"]);

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

function preventWidows(text: string) {
  return text.replace(widowPattern, "$1$2\u00A0");
}

function processNode(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") return preventWidows(child);
    if (!isValidElement(child) || typeof child.type !== "string" || ignoredTags.has(child.type)) return child;

    const element = child as ElementWithChildren;
    return cloneElement(element, undefined, processNode(element.props.children));
  });
}

/** Безопасно устраняет висячие предлоги в статичном текстовом содержимом React-дерева. */
export function NoWidows({ children }: { children: ReactNode }) {
  return <>{processNode(children)}</>;
}
