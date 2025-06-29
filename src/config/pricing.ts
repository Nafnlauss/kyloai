// Pricing configuration - centralized pricing information
// Prices are in cents (divide by 100 for display)

export const PRICING_CONFIG = {
  // Subscription plans
  plans: {
    FREE: {
      id: 'FREE',
      name: 'Free',
      displayName: 'Free',
      description: 'Perfect for trying out',
      monthlyPrice: 0,
      yearlyPrice: 0,
      monthlyCredits: 300,
      features: [
        '300 free credits',
        'Videos up to 5 seconds',
        'Slower generation speed',
        'No commercial use',
        'Cannot buy credit packages',
        'Watermark',
        'Email support'
      ]
    },
    LITE: {
      id: 'LITE',
      name: 'lite',
      displayName: 'Basic',
      description: 'For beginner creators',
      monthlyPrice: 800, // $8.00
      yearlyPrice: 7680, // $76.80 (20% discount)
      monthlyCredits: 100,
      yearlyCredits: 1200, // 100 x 12
      features: [
        '100 credits per month',
        'Videos up to 10 seconds',
        '720p resolution',
        'Email support',
        'No watermark',
      ],
      monthlyFeatures: [
        'Credits don\'t accumulate',
        'Monthly renewal',
      ],
      yearlyFeatures: [
        '1,200 annual accumulative credits',
        'Use anytime during the year',
        '20% savings',
      ],
      notIncluded: [
        'Full HD videos',
        'Commercial use',
        'Priority queue',
      ]
    },
    CREATOR: {
      id: 'CREATOR',
      name: 'creator',
      displayName: 'Creator',
      description: 'For professionals',
      monthlyPrice: 2600, // $26.00
      yearlyPrice: 24960, // $249.60 (20% discount)
      monthlyCredits: 500,
      yearlyCredits: 6000, // 500 x 12
      popular: true,
      features: [
        '500 credits per month',
        'Videos up to 15 seconds',
        'Full HD resolution',
        'Commercial use allowed',
        'No watermark',
        'Priority queue',
        'Priority support',
      ],
      monthlyFeatures: [
        'Credits don\'t accumulate',
        'Monthly renewal',
      ],
      yearlyFeatures: [
        '6,000 annual accumulative credits',
        'Use anytime during the year',
        '20% savings',
      ],
      notIncluded: [
        'API Access',
        'Advanced analytics',
      ]
    },
    PROFESSIONAL: {
      id: 'PROFESSIONAL',
      name: 'professional',
      displayName: 'Professional',
      description: 'For businesses and agencies',
      monthlyPrice: 6800, // $68.00
      yearlyPrice: 65280, // $652.80 (20% discount)
      monthlyCredits: 2000,
      yearlyCredits: 24000, // 2000 x 12
      features: [
        '2000 credits per month',
        'Videos up to 30 seconds',
        'Full HD resolution',
        'Unlimited commercial use',
        'API Access',
        'Priority support',
        'Advanced analytics',
        'Multiple users',
        'Priority queue',
      ],
      monthlyFeatures: [
        'Credits don\'t accumulate',
        'Monthly renewal',
      ],
      yearlyFeatures: [
        '24,000 annual accumulative credits',
        'Use anytime during the year',
        '20% savings',
      ],
      notIncluded: []
    }
  },
  
  // Credit packs
  creditPacks: {
    PACK_1000: {
      id: 'PACK_1000',
      credits: 1000,
      price: 800, // $8.00
      pricePerCredit: 0.25,
      name: 'Pro'
    },
    PACK_2500: {
      id: 'PACK_2500',
      credits: 2500,
      price: 1800, // $18.00
      pricePerCredit: 0.22,
      popular: true,
      name: 'Business',
      savings: 'Save $0.03/credit'
    },
    PACK_7000: {
      id: 'PACK_7000',
      credits: 7000,
      price: 4500, // $45.00
      pricePerCredit: 0.20,
      bestValue: true,
      name: 'Enterprise',
      savings: 'Save $0.05/credit'
    },
    PACK_16000: {
      id: 'PACK_16000',
      credits: 16000,
      price: 9000, // $90.00
      pricePerCredit: 0.175,
      maximum: true,
      name: 'Ultimate',
      savings: 'Save $0.075/credit - Best price!'
    }
  },
  
  // Credit usage per provider
  creditUsage: {
    luma: {
      v1: {
        creditsPerSecond: 6,
        maxDuration: 5,
        quality: 'standard'
      },
      v2: {
        creditsPerSecond: 12,
        maxDuration: 5,
        quality: 'premium'
      }
    },
    kling: {
      v1: {
        creditsPerSecond: 8,
        maxDuration: 5,
        quality: 'standard'
      },
      v2: {
        creditsPerSecond: 20,
        maxDuration: 10,
        quality: 'professional'
      },
      v2_1: {
        creditsPerSecond: 20,
        maxDuration: 15,
        quality: 'professional'
      }
    }
  }
};

// Helper functions
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getYearlyDiscount(): number {
  return 20; // 20% discount for yearly plans
}

export function calculateYearlyPrice(monthlyPrice: number): number {
  const yearlyTotal = monthlyPrice * 12;
  const discount = yearlyTotal * (getYearlyDiscount() / 100);
  return Math.round(yearlyTotal - discount);
}