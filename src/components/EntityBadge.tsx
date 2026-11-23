import { Badge, type BadgeProps } from "@/components/ui/badge";

// Entity-type badge used anywhere a list of clients/engagements needs to visually distinguish
// Corporation vs. Partnership vs. Trust at a glance (Dashboard, Engagements). One shared mapping
// so the colors stay consistent everywhere this is used.
const ENTITY_BADGE_VARIANT: Record<string, BadgeProps["variant"]> = {
 Corporation: "info",
 Partnership: "warning",
 Trust: "feature",
};

export function entityBadgeBase(entityType: string | undefined): string {
 // Strips a parenthetical suffix like "Corporation (CCPC)" down to the base entity kind.
 return (entityType ?? "Corporation").replace(/\s*\(.*\)\s*$/, "").trim();
}

export function EntityBadge({ entityType, className }: { entityType: string | undefined; className?: string }) {
 const base = entityBadgeBase(entityType);
 const variant = ENTITY_BADGE_VARIANT[base] ?? "secondary";
 return <Badge variant={variant} className={className}>{base}</Badge>;
}
