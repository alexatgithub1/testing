import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    let analyzedData: any = {}

    // Process based on file type
    if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
      analyzedData = await analyzeExcel(buffer, fileExtension)
    } else if (fileExtension === 'pdf') {
      analyzedData = await analyzePDF(buffer)
    } else if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg') {
      analyzedData = await analyzeImage(buffer, file.type)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: fileExtension,
      data: analyzedData,
    })

  } catch (error) {
    console.error('File analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze file' },
      { status: 500 }
    )
  }
}

async function analyzeExcel(buffer: Buffer, extension: string) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // Smart detection of data structure
    const analyzed = smartAnalyze(jsonData)

    return analyzed
  } catch (error) {
    console.error('Excel analysis error:', error)
    throw error
  }
}

function smartAnalyze(data: any[]) {
  if (!data || data.length === 0) {
    return { message: 'No data found in file' }
  }

  const firstRow = data[0]
  const columns = Object.keys(firstRow)

  // Detect common metric columns
  const detectedMetrics: any = {
    dates: [],
    revenue: [],
    users: [],
    dau: [],
    mau: [],
  }

  // Look for date columns
  const dateColumn = columns.find(col =>
    col.toLowerCase().includes('date') ||
    col.toLowerCase().includes('time') ||
    col.toLowerCase().includes('day')
  )

  // Look for revenue columns
  const revenueColumn = columns.find(col =>
    col.toLowerCase().includes('revenue') ||
    col.toLowerCase().includes('sales') ||
    col.toLowerCase().includes('income')
  )

  // Look for user columns
  const dauColumn = columns.find(col =>
    col.toLowerCase().includes('dau') ||
    col.toLowerCase() === 'daily active users'
  )

  const mauColumn = columns.find(col =>
    col.toLowerCase().includes('mau') ||
    col.toLowerCase() === 'monthly active users'
  )

  // Extract data
  data.forEach(row => {
    if (dateColumn) detectedMetrics.dates.push(row[dateColumn])
    if (revenueColumn) detectedMetrics.revenue.push(parseNumber(row[revenueColumn]))
    if (dauColumn) detectedMetrics.dau.push(parseNumber(row[dauColumn]))
    if (mauColumn) detectedMetrics.mau.push(parseNumber(row[mauColumn]))
  })

  // Calculate summary stats
  const summary = {
    totalRows: data.length,
    columnsDetected: columns,
    metrics: {
      ...(detectedMetrics.revenue.length > 0 && {
        revenue: {
          values: detectedMetrics.revenue,
          total: detectedMetrics.revenue.reduce((a: number, b: number) => a + b, 0),
          average: detectedMetrics.revenue.reduce((a: number, b: number) => a + b, 0) / detectedMetrics.revenue.length,
        }
      }),
      ...(detectedMetrics.dau.length > 0 && {
        dau: {
          values: detectedMetrics.dau,
          latest: detectedMetrics.dau[detectedMetrics.dau.length - 1],
          average: detectedMetrics.dau.reduce((a: number, b: number) => a + b, 0) / detectedMetrics.dau.length,
        }
      }),
      ...(detectedMetrics.mau.length > 0 && {
        mau: {
          values: detectedMetrics.mau,
          latest: detectedMetrics.mau[detectedMetrics.mau.length - 1],
          average: detectedMetrics.mau.reduce((a: number, b: number) => a + b, 0) / detectedMetrics.mau.length,
        }
      }),
    },
    dates: detectedMetrics.dates,
    rawData: data.slice(0, 10), // Include first 10 rows for preview
  }

  return summary
}

function parseNumber(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    // Remove common formatting (commas, dollar signs, etc.)
    const cleaned = value.replace(/[$,]/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

async function analyzePDF(buffer: Buffer) {
  // For now, return a placeholder
  // To fully implement, you'd use pdf-parse library
  return {
    message: 'PDF analysis coming soon. For now, please convert to Excel or CSV.',
    placeholder: true
  }
}

async function analyzeImage(buffer: Buffer, mimeType: string) {
  // For now, return a placeholder
  // To fully implement, you'd use Claude Vision API or OCR
  return {
    message: 'Image analysis coming soon. Claude Vision API integration required.',
    placeholder: true,
    suggestion: 'Please provide an API key to enable image analysis.'
  }
}

export const runtime = 'nodejs'
export const maxDuration = 60
