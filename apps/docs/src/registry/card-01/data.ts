export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: 9,
    period: "month",
    buttonText: "Get Started",
    features: [
      { name: "Up to 5 projects", included: true },
      { name: "10GB storage", included: true },
      { name: "Basic support", included: true },
      { name: "API access", included: false },
      { name: "Advanced analytics", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Best for growing teams and businesses",
    price: 29,
    period: "month",
    buttonText: "Start Free Trial",
    popular: true,
    features: [
      { name: "Unlimited projects", included: true },
      { name: "100GB storage", included: true },
      { name: "Priority support", included: true },
      { name: "API access", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: 99,
    period: "month",
    buttonText: "Contact Sales",
    features: [
      { name: "Unlimited everything", included: true },
      { name: "1TB storage", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Full API access", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: true },
    ],
  },
];
