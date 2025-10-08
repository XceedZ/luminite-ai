import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleHelpIcon } from "lucide-react";

type PricingCardProps = {
  title?: string;
  description?: string;
  priceText?: string; // e.g. "$20"
  priceUnit?: string; // e.g. "/mo"
  ctaLabel?: string;
};

export default function PricingCard({
  title = "Pro Plan",
  description =
    "For teams that need advanced scheduling tools to streamline workflows and enhance collaboration, ensuring every meeting is productive and on track.",
  priceText = "$20",
  priceUnit = "/mo",
  ctaLabel = "Try for free",
}: PricingCardProps) {
  return (
    <Card className="max-w-xs w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex items-end leading-6">
        <span className="text-4xl leading-none font-bold text-foreground">
          {priceText}
        </span>
        <span className="ml-1.5 mr-1">{priceUnit}</span>
        <Tooltip>
          <TooltipTrigger className="mb-1">
            <CircleHelpIcon className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>
              Seats are required for users to connect calendars and create
              Calendly links to help book meetings - meeting invitees do not
              require an account or seat.
            </p>
          </TooltipContent>
        </Tooltip>
      </CardContent>
      <CardFooter className="mt-2 flex justify-between">
        <Button size="lg" className="w-full">
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
