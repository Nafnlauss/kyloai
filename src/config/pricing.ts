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
      displayName: 'Básico',
      description: 'Para criadores iniciantes',
      monthlyPrice: 4900, // R$ 49,00
      yearlyPrice: 47040, // R$ 470,40 (20% discount)
      monthlyCredits: 100,
      yearlyCredits: 1200, // 100 x 12
      features: [
        '100 créditos por mês',
        'Vídeos até 10 segundos',
        'Resolução 720p',
        'Suporte por email',
        'Sem marca d\'água',
      ],
      monthlyFeatures: [
        'Créditos não acumulam',
        'Renovação mensal',
      ],
      yearlyFeatures: [
        '1.200 créditos anuais acumulativos',
        'Use quando quiser durante o ano',
        'Economia de 20%',
      ],
      notIncluded: [
        'Vídeos em Full HD',
        'Uso comercial',
        'Fila prioritária',
      ]
    },
    CREATOR: {
      id: 'CREATOR',
      name: 'creator',
      displayName: 'Criador',
      description: 'Para profissionais',
      monthlyPrice: 19900, // R$ 199,00
      yearlyPrice: 191040, // R$ 1.910,40 (20% discount)
      monthlyCredits: 500,
      yearlyCredits: 6000, // 500 x 12
      popular: true,
      features: [
        '500 créditos por mês',
        'Vídeos até 15 segundos',
        'Resolução Full HD',
        'Uso comercial permitido',
        'Sem marca d\'água',
        'Fila prioritária',
        'Suporte prioritário',
      ],
      monthlyFeatures: [
        'Créditos não acumulam',
        'Renovação mensal',
      ],
      yearlyFeatures: [
        '6.000 créditos anuais acumulativos',
        'Use quando quiser durante o ano',
        'Economia de 20%',
      ],
      notIncluded: [
        'API Access',
        'Analytics avançado',
      ]
    },
    PROFESSIONAL: {
      id: 'PROFESSIONAL',
      name: 'professional',
      displayName: 'Profissional',
      description: 'Para empresas e agências',
      monthlyPrice: 69900, // R$ 699,00
      yearlyPrice: 671040, // R$ 6.710,40 (20% discount)
      monthlyCredits: 2000,
      yearlyCredits: 24000, // 2000 x 12
      features: [
        '2000 créditos por mês',
        'Vídeos até 30 segundos',
        'Resolução Full HD',
        'Uso comercial ilimitado',
        'API Access',
        'Suporte prioritário',
        'Analytics avançado',
        'Múltiplos usuários',
        'Fila prioritária',
      ],
      monthlyFeatures: [
        'Créditos não acumulam',
        'Renovação mensal',
      ],
      yearlyFeatures: [
        '24.000 créditos anuais acumulativos',
        'Use quando quiser durante o ano',
        'Economia de 20%',
      ],
      notIncluded: []
    }
  },
  
  // Credit packs
  creditPacks: {
    PACK_1000: {
      id: 'PACK_1000',
      credits: 1000,
      price: 24990, // R$ 249,90
      pricePerCredit: 0.25,
      name: 'Pro'
    },
    PACK_2500: {
      id: 'PACK_2500',
      credits: 2500,
      price: 54990, // R$ 549,90
      pricePerCredit: 0.22,
      popular: true,
      name: 'Business',
      savings: 'Save R$ 0,03/credit'
    },
    PACK_7000: {
      id: 'PACK_7000',
      credits: 7000,
      price: 139990, // R$ 1.399,90
      pricePerCredit: 0.20,
      bestValue: true,
      name: 'Enterprise',
      savings: 'Save R$ 0,05/credit'
    },
    PACK_16000: {
      id: 'PACK_16000',
      credits: 16000,
      price: 279990, // R$ 2.799,90
      pricePerCredit: 0.175,
      maximum: true,
      name: 'Ultimate',
      savings: 'Save R$ 0,075/credit - Best price!'
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
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export function getYearlyDiscount(): number {
  return 20; // 20% discount for yearly plans
}

export function calculateYearlyPrice(monthlyPrice: number): number {
  const yearlyTotal = monthlyPrice * 12;
  const discount = yearlyTotal * (getYearlyDiscount() / 100);
  return Math.round(yearlyTotal - discount);
}