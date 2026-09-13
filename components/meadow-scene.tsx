import { cn } from "@/lib/utils";
import { GrassFold } from "./grass-fold";

/** Decorative landscape, adapted from fetch.madebynikesh.com. */
export function MeadowScene({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("meadow-scene", className)}>
      <img
        className="meadow-cloud meadow-cloud-one"
        src="/scenery/cloud.webp"
        alt=""
      />
      <img
        className="meadow-cloud meadow-cloud-two"
        src="/scenery/cloud.webp"
        alt=""
      />
      <GrassFold />
    </div>
  );
}
