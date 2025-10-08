import PricingCard from "@/components/customized/card/card-05";

export default function PricingPage() {
  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Pricing</h1>
          <p className="text-muted-foreground mt-2">Choose the plan that fits your needs.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
          <PricingCard
            title="Free Plan"
            description="For individuals exploring the product with basic needs"
            priceText="$0"
            priceUnit="/mo"
            ctaLabel="Get started"
          />
          <PricingCard
            title="Pro Plan"
            description="For professionals who need more power and features"
            priceText="$20"
            priceUnit="/mo"
            ctaLabel="Try for free"
          />
          <PricingCard
            title="Enterprise Plan"
            description="For organizations requiring advanced controls and support"
            priceText="Custom"
            priceUnit=""
            ctaLabel="Contact sales"
          />
        </div>
      </div>
    </main>
  );
}
