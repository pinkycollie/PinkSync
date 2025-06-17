/**
 * PinkSync Ecosystem Revenue Projections
 *
 * This module provides revenue projections and financial
 * analysis for the complete business ecosystem.
 */

/**
 * Revenue Projection by Business Component
 */
export interface ComponentRevenue {
  component: string
  year1: number
  year2: number
  year3: number
  cagr: number // Compound Annual Growth Rate
}

export const revenueProjections: ComponentRevenue[] = [
  {
    component: "PinkSync",
    year1: 875000,
    year2: 1312500,
    year3: 1837500,
    cagr: 0.45, // 45%
  },
  {
    component: "VCode",
    year1: 625000,
    year2: 937500,
    year3: 1312500,
    cagr: 0.45, // 45%
  },
  {
    component: "360 Magicians",
    year1: 500000,
    year2: 750000,
    year3: 1050000,
    cagr: 0.45, // 45%
  },
  {
    component: "DeafAuth",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    cagr: 0.45, // 45%
  },
  {
    component: "FibonRose",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    cagr: 0.45, // 45%
  },
]

/**
 * Revenue by Customer Segment
 */
export interface SegmentRevenue {
  segment: string
  year1: number
  year2: number
  year3: number
  percentageOfTotal: number
}

export const segmentRevenues: SegmentRevenue[] = [
  {
    segment: "Enterprise",
    year1: 1000000,
    year2: 1500000,
    year3: 2100000,
    percentageOfTotal: 0.4, // 40%
  },
  {
    segment: "SMB",
    year1: 750000,
    year2: 1125000,
    year3: 1575000,
    percentageOfTotal: 0.3, // 30%
  },
  {
    segment: "Deaf Community Organizations",
    year1: 500000,
    year2: 750000,
    year3: 1050000,
    percentageOfTotal: 0.2, // 20%
  },
  {
    segment: "Individual Professionals",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    percentageOfTotal: 0.1, // 10%
  },
]

/**
 * Revenue by Geographic Region
 */
export interface RegionalRevenue {
  region: string
  year1: number
  year2: number
  year3: number
  growthRate: number
}

export const regionalRevenues: RegionalRevenue[] = [
  {
    region: "North America",
    year1: 1500000,
    year2: 2250000,
    year3: 3150000,
    growthRate: 0.45, // 45%
  },
  {
    region: "Europe",
    year1: 500000,
    year2: 750000,
    year3: 1050000,
    growthRate: 0.45, // 45%
  },
  {
    region: "Asia Pacific",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    growthRate: 0.45, // 45%
  },
  {
    region: "Rest of World",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    growthRate: 0.45, // 45%
  },
]

/**
 * Revenue by Product/Service Type
 */
export interface ProductRevenue {
  productType: string
  year1: number
  year2: number
  year3: number
  percentageOfTotal: number
}

export const productRevenues: ProductRevenue[] = [
  {
    productType: "Subscription Services",
    year1: 1250000,
    year2: 1875000,
    year3: 2625000,
    percentageOfTotal: 0.5, // 50%
  },
  {
    productType: "Professional Services",
    year1: 625000,
    year2: 937500,
    year3: 1312500,
    percentageOfTotal: 0.25, // 25%
  },
  {
    productType: "Usage-Based Services",
    year1: 375000,
    year2: 562500,
    year3: 787500,
    percentageOfTotal: 0.15, // 15%
  },
  {
    productType: "Training & Support",
    year1: 250000,
    year2: 375000,
    year3: 525000,
    percentageOfTotal: 0.1, // 10%
  },
]

/**
 * Financial Analysis
 */
export const financialAnalysis = {
  profitabilityMetrics: {
    grossMargin: {
      year1: 0.65, // 65%
      year2: 0.68, // 68%
      year3: 0.7, // 70%
    },
    operatingMargin: {
      year1: 0.2, // 20%
      year2: 0.24, // 24%
      year3: 0.3, // 30%
    },
    netMargin: {
      year1: 0.15, // 15%
      year2: 0.18, // 18%
      year3: 0.22, // 22%
    },
  },
  efficiencyMetrics: {
    customerAcquisitionCost: {
      year1: 5000,
      year2: 4500,
      year3: 4000,
    },
    lifetimeValue: {
      year1: 25000,
      year2: 30000,
      year3: 35000,
    },
    lvToCacRatio: {
      year1: 5.0,
      year2: 6.7,
      year3: 8.8,
    },
  },
  investmentMetrics: {
    roi: {
      year1: 0.25, // 25%
      year2: 0.35, // 35%
      year3: 0.45, // 45%
    },
    paybackPeriod: 1.5, // 18 months
    irr: 0.4, // 40% Internal Rate of Return
  },
}

/**
 * Financial Scenarios
 */
export const financialScenarios = {
  conservative: {
    revenueMultiplier: 0.8, // 80% of base projections
    marginImpact: -0.05, // 5% lower margins
    growthRate: 0.35, // 35% growth rate
  },
  base: {
    revenueMultiplier: 1.0, // 100% of base projections
    marginImpact: 0.0, // No change to margins
    growthRate: 0.45, // 45% growth rate
  },
  optimistic: {
    revenueMultiplier: 1.2, // 120% of base projections
    marginImpact: 0.05, // 5% higher margins
    growthRate: 0.55, // 55% growth rate
  },
}

/**
 * Revenue Projection Calculator
 */
export class RevenueProjectionCalculator {
  /**
   * Calculate total ecosystem revenue
   */
  static calculateTotalRevenue() {
    const totalByYear = {
      year1: revenueProjections.reduce((sum, component) => sum + component.year1, 0),
      year2: revenueProjections.reduce((sum, component) => sum + component.year2, 0),
      year3: revenueProjections.reduce((sum, component) => sum + component.year3, 0),
    }

    const cagr = Math.pow(totalByYear.year3 / totalByYear.year1, 1 / 2) - 1

    return {
      totalByYear,
      cagr,
      componentBreakdown: revenueProjections.map((component) => ({
        component: component.component,
        year3Revenue: component.year3,
        percentageOfTotal: component.year3 / totalByYear.year3,
      })),
    }
  }

  /**
   * Generate financial projection report
   */
  static generateFinancialReport() {
    const totalRevenue = this.calculateTotalRevenue()

    return {
      reportTitle: "PinkSync Ecosystem Financial Projections",
      generatedDate: new Date().toISOString(),
      executiveSummary: [
        `Total projected revenue by Year 3: $${totalRevenue.totalByYear.year3.toLocaleString()}`,
        `Compound Annual Growth Rate (CAGR): ${(totalRevenue.cagr * 100).toFixed(1)}%`,
        `Projected operating margin by Year 3: ${(financialAnalysis.profitabilityMetrics.operatingMargin.year3 * 100).toFixed(1)}%`,
        `Return on Investment (ROI) by Year 3: ${(financialAnalysis.investmentMetrics.roi.year3 * 100).toFixed(1)}%`,
        "360 Magicians fully integrated into revenue projections",
      ],
      keyFinancialMetrics: {
        revenueGrowth: totalRevenue.cagr,
        operatingMargin: financialAnalysis.profitabilityMetrics.operatingMargin.year3,
        lvToCacRatio: financialAnalysis.efficiencyMetrics.lvToCacRatio.year3,
        roi: financialAnalysis.investmentMetrics.roi.year3,
      },
      componentContribution: totalRevenue.componentBreakdown,
      strategicRecommendations: [
        "Focus on enterprise segment for highest revenue potential",
        "Increase subscription services for recurring revenue stability",
        "Expand North American market presence for near-term growth",
        "Invest in cross-selling between ecosystem components",
        "Develop bundled offerings for increased customer value",
      ],
    }
  }
}
