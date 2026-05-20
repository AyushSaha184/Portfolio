/**
 * Icon.tsx — Tree-shakeable FontAwesome SVG wrapper.
 *
 * Why not `@fortawesome/fontawesome-free/css/all.min.css`?
 *   • all.min.css ships ~1 MB of CSS + font files for 2,000+ icons.
 *   • This component only bundles the SVG path data for the icons you
 *     import here, reducing icon weight to ~3–5 KB total.
 *
 * Usage:
 *   import Icon from "@/components/ui/Icon";
 *   <Icon id="faGithub" />
 *   <Icon id="faDownload" className="text-amber-400" />
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

// ── Solid icons ──────────────────────────────────────────────────────────────
import {
  faCode,
  faDatabase,
  faCloud,
  faBook,
  faRobot,
  faLayerGroup,
  faServer,
  faBolt,
  faLink,
  faProjectDiagram,
  faLanguage,
  faBrain,
  faMagnifyingGlass,
  faMicrochip,
  faNetworkWired,
  faCheck,
  faImage,
  faStar,
  faCodeBranch,
  faArrowUpRightFromSquare,
  faDownload,
  faArrowRight,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

// ── Brand icons ──────────────────────────────────────────────────────────────
import {
  faJava,
  faPython,
  faGitAlt,
  faDocker,
  faGithub,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

// ── Icon registry ────────────────────────────────────────────────────────────
// Maps the legacy FontAwesome CSS class name to the SVG icon object so that
// existing `SKILL_ICON_MAP` and data files need minimal changes.
const ICON_REGISTRY: Record<string, IconProp> = {
  // Solid
  "fas fa-code":               faCode,
  "fas fa-database":           faDatabase,
  "fas fa-cloud":              faCloud,
  "fas fa-book":               faBook,
  "fas fa-robot":              faRobot,
  "fas fa-layer-group":        faLayerGroup,
  "fas fa-server":             faServer,
  "fas fa-bolt":               faBolt,
  "fas fa-link":               faLink,
  "fas fa-project-diagram":    faProjectDiagram,
  "fas fa-language":           faLanguage,
  "fas fa-brain":              faBrain,
  "fas fa-search":             faMagnifyingGlass,
  "fas fa-microchip":          faMicrochip,
  "fas fa-network-wired":      faNetworkWired,
  "fas fa-check":              faCheck,
  "fas fa-image":              faImage,
  "fas fa-star":               faStar,
  "fas fa-code-branch":        faCodeBranch,
  "fas fa-external-link-alt":  faArrowUpRightFromSquare,
  "fas fa-download":           faDownload,
  "fas fa-arrow-right":        faArrowRight,
  "fas fa-envelope":           faEnvelope,
  // Brand
  "fab fa-java":               faJava,
  "fab fa-python":             faPython,
  "fab fa-git-alt":            faGitAlt,
  "fab fa-docker":             faDocker,
  "fab fa-github":             faGithub,
  "fab fa-linkedin-in":        faLinkedinIn,
  "fab fa-x-twitter":          faXTwitter,
};

// ── Component ────────────────────────────────────────────────────────────────
interface IconProps {
  /**
   * The FontAwesome CSS identifier, e.g. "fas fa-github" or "fab fa-python".
   * Used as a lookup key in the registry above.
   */
  id: string;
  /** Additional Tailwind / CSS classes forwarded to the SVG element. */
  className?: string;
  /** Accessible label; omit for decorative icons. */
  title?: string;
}

export default function Icon({ id, className, title }: IconProps) {
  // Strip colour/size utility classes before the lookup (e.g. "fab fa-java text-orange-500")
  const baseId = id
    .split(" ")
    .filter((t) => t.startsWith("fa") && !t.startsWith("fa-"))
    .concat(id.split(" ").filter((t) => t.startsWith("fa-")))
    .slice(0, 2)
    .join(" ");

  const icon = ICON_REGISTRY[baseId];

  if (!icon) {
    // Fallback: render a visually neutral placeholder in development
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Icon] Unknown id: "${id}" (resolved base: "${baseId}")`);
    }
    return null;
  }

  // Collect any extra utility tokens from the original string (e.g. colour)
  const extraClasses = id
    .split(" ")
    .filter((t) => !t.startsWith("fa"))
    .join(" ");

  return (
    <FontAwesomeIcon
      icon={icon}
      className={[extraClasses, className].filter(Boolean).join(" ")}
      aria-hidden={!title}
      title={title}
    />
  );
}
