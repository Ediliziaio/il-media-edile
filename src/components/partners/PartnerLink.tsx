import { Link } from "react-router";
import type { AnchorHTMLAttributes } from "react";
export function PartnerLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) { return <Link to={href} {...props} />; }
