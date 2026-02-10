'use client'

import { create } from 'zustand'
import { mockData } from './mockData'

interface DashboardStore {
  data: any
  useUploadedData: boolean
  uploadedData: any | null
  setUploadedData: (data: any) => void
  toggleDataSource: () => void
  getCurrentData: () => any
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  data: mockData,
  useUploadedData: false,
  uploadedData: null,

  setUploadedData: (data: any) => {
    set({ uploadedData: data, useUploadedData: true })
  },

  toggleDataSource: () => {
    set((state) => ({ useUploadedData: !state.useUploadedData }))
  },

  getCurrentData: () => {
    const state = get()
    if (state.useUploadedData && state.uploadedData) {
      // Merge uploaded data with mock data (uploaded takes precedence)
      return {
        ...mockData,
        ...transformUploadedData(state.uploadedData),
      }
    }
    return mockData
  },
}))

function transformUploadedData(uploadedData: any) {
  // Transform uploaded data to match dashboard format
  const transformed: any = {}

  if (uploadedData.metrics?.revenue) {
    transformed.revenue = {
      mtd: uploadedData.metrics.revenue.total || mockData.revenue.mtd,
      change: 0, // Calculate from data if available
      projected: uploadedData.metrics.revenue.total * 1.5 || mockData.revenue.projected,
    }
  }

  if (uploadedData.metrics?.dau) {
    transformed.dau = {
      value: uploadedData.metrics.dau.latest || mockData.dau.value,
      change: 0, // Calculate from trend
      sparkline: uploadedData.metrics.dau.values || mockData.dau.sparkline,
    }
  }

  if (uploadedData.metrics?.mau) {
    transformed.mau = {
      value: uploadedData.metrics.mau.latest || mockData.mau.value,
      change: 0, // Calculate from trend
      sparkline: uploadedData.metrics.mau.values || mockData.mau.sparkline,
    }
  }

  return transformed
}
